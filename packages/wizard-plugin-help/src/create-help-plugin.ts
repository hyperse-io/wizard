import { defineCommand, definePlugin, useLocale } from '@hyperse/wizard-core';
import { HelperExitPipelineException } from './errors/HelperExitPipelineException.js';
import { exitPipeline } from './helpers/helper-exit-pipline.js';
import { printHelp } from './helpers/helper-print-help.js';
import { helpMessages } from './i18n/messages.js';
import { renderCli } from './render-cli.js';
import { renderCommand } from './render-command.js';
import { renderFlags } from './render-flags.js';
import { renderGlobal } from './render-global.js';
import { renderSubcommands } from './render-subcommands.js';
import { renderUsage } from './render-usage.js';

export const createHelpPlugin = () => {
  return definePlugin({
    localeMessages: helpMessages,
    name: 'plugins.helpPlugin.name',
    setup: (wizard) => {
      const { t } = wizard.i18n;
      const cli = wizard.register(
        defineCommand('help', {
          description: 'plugins.helpPlugin.description',
          help: 'plugins.helpPlugin.help',
          example: 'plugins.helpPlugin.example',
        }).handler((ctx) => {
          console.log(ctx);
        })
      );

      // support -h/--help flag
      cli.flag(
        'help',
        {
          type: Boolean,
          description: 'plugins.helpPlugin.description',
          default: false,
          alias: 'h',
        },
        (ctx) => {
          const flags = ctx.flags;
          if (flags.help) {
            const commandChain = wizard.commandChain;
            const lastCommand = commandChain[commandChain.length - 1];
            const message: (string | undefined)[] = [];
            message.push(renderCli(t, wizard));
            message.push(renderUsage(t, wizard, lastCommand));
            message.push(renderCommand(t, lastCommand, wizard));
            message.push(renderSubcommands(t, lastCommand, wizard));
            message.push(renderGlobal(t, wizard));
            message.push(renderFlags(t, lastCommand.flags));
            const helpMessage = message.filter(Boolean).join('\n\n');
            printHelp(`\n${helpMessage}\n\n`);
            exitPipeline();
          }
        }
      );
      cli.errorHandler((error) => {
        if (error instanceof HelperExitPipelineException) {
          process.exit(0);
        }
      });
      return cli;
    },
  });
};
