import type { DeepPartial } from '@hyperse/deep-merge';
import {
  defineCommand,
  definePlugin,
  localeMessageValue,
} from '@hyperse/wizard-core';
import { mergeMessages } from './helpers/helper-merge-messages.js';
import { printHelp } from './helpers/helper-print-help.js';
import type { HelpPluginLocaleOverrideMessages } from './i18n/i18n.js';
import { helpMessages } from './i18n/messages.js';
import { renderCli } from './renders/render-cli.js';
import { renderCommand } from './renders/render-command.js';
import { renderExample } from './renders/render-example.js';
import { renderFlags } from './renders/render-flags.js';
import { renderGlobal } from './renders/render-global.js';
import { renderHelp } from './renders/render-help.js';
import { renderSubcommands } from './renders/render-subcommands.js';
import { renderUsage } from './renders/render-usage.js';

export type HelpPluginOptions = {
  /**
   * Whether to register the global help flag (-h/--help).
   *
   * If true, the -h/--help flag will be automatically added to all commands,
   * allowing users to display help information via the flag.
   * If false, the flag will not be registered and users must invoke the help command manually.
   *
   * @default true
   */
  flag?: boolean;

  /**
   * Whether to display the banner text at the top of the help message.
   *
   * If true, must provide the banner text via the overrideLocaleMessages option.
   *
   * @example
   * ```ts
   * createHelpPlugin({
   *   showBanner: true,
   *   overrideLocaleMessages: {
   *     en: { helpPlugin: { banner: '🎉 Complex CLI Banner 🎉' } },
   *   },
   * });
   * ```
   *
   * @default false
   */
  showBanner?: boolean;

  /**
   * Whether to display the footer text at the bottom of the help message.
   *
   * If true, must provide the footer text via the overrideLocaleMessages option.
   *
   * @example
   * ```ts
   * createHelpPlugin({
   *   showFooter: true,
   *   overrideLocaleMessages: {
   *     en: { helpPlugin: { footer: '🎉 Complex CLI Footer 🎉' } },
   *   },
   * });
   * ```
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Override locale messages.
   *
   * @example
   * ```ts
   * createHelpPlugin({
   *   overrideLocaleMessages: {
   *     en: { helpPlugin: { banner: '🎉 Complex CLI Banner 🎉' } },
   *   },
   * });
   * ```
   *
   * @default {}
   */
  overrideLocaleMessages?: DeepPartial<HelpPluginLocaleOverrideMessages>;
};

export const createHelpPlugin = (options: HelpPluginOptions = {}) => {
  const {
    flag = true,
    showBanner = false,
    showFooter = false,
    overrideLocaleMessages = {},
  } = options;
  const localeMessages = mergeMessages(helpMessages, overrideLocaleMessages);
  return definePlugin({
    localeMessages: localeMessages,
    name: 'plugins.helpPlugin.name',
    setup: (wizard) => {
      const { t } = wizard.i18n;
      const cli = wizard.register(
        defineCommand('help', {
          description: 'plugins.helpPlugin.command.description',
          example: 'plugins.helpPlugin.command.example',
        }).handler(() => {
          const commandChain = wizard.commandChain;
          const lastCommand = commandChain[commandChain.length - 1];

          const message: (string | undefined)[] = [];
          if (showBanner) {
            message.push(localeMessageValue(t, 'plugins.helpPlugin.banner'));
          }
          message.push(renderCli(t, wizard, lastCommand));
          message.push(renderUsage(t, wizard, lastCommand));
          message.push(renderHelp(t, lastCommand));
          message.push(renderExample(t, lastCommand));
          message.push(renderCommand(t, lastCommand, wizard));
          message.push(renderSubcommands(t, lastCommand, wizard));
          message.push(renderGlobal(t, wizard));
          if (showFooter) {
            message.push(localeMessageValue(t, 'plugins.helpPlugin.footer'));
          }
          const helpMessage = message.filter(Boolean).join('\n\n');
          printHelp(`\n${helpMessage}\n\n`);
        })
      );

      if (flag) {
        // support -h/--help flag
        cli
          .flag('help', {
            type: Boolean,
            description: 'plugins.helpPlugin.flags.help',
            default: false,
            alias: 'h',
          })
          .interceptor(async (ctx, next) => {
            const flags = ctx.flags;
            if (flags.help) {
              const commandChain = wizard.commandChain;
              const lastCommand = commandChain[commandChain.length - 1];
              const message: (string | undefined)[] = [];
              if (showBanner) {
                message.push(
                  localeMessageValue(t, 'plugins.helpPlugin.banner')
                );
              }
              message.push(renderCli(t, wizard, lastCommand));
              message.push(renderUsage(t, wizard, lastCommand));
              message.push(renderHelp(t, lastCommand));
              message.push(renderExample(t, lastCommand));
              message.push(renderCommand(t, lastCommand, wizard));
              message.push(renderSubcommands(t, lastCommand, wizard));
              message.push(renderGlobal(t, wizard));
              message.push(renderFlags(t, lastCommand.flags));
              if (showFooter) {
                message.push(
                  localeMessageValue(t, 'plugins.helpPlugin.footer')
                );
              }
              const helpMessage = message.filter(Boolean).join('\n\n');
              printHelp(`\n${helpMessage}\n\n`);
            } else {
              await next();
            }
          });
      }
      return cli;
    },
  });
};
