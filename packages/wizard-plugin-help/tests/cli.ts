import type { DefineMessageType } from '@hyperse/wizard';
import { createWizard, defineCommand, definePlugin } from '@hyperse/wizard';
import { createHelpPlugin } from '../src/create-help-plugin.js';
import { buildPluginMessages, helpCliMessages } from './i18n/message.js';

process.env.HPS_WIZARD_LOCALE = 'en';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages extends DefineMessageType<
    typeof helpCliMessages
  > {}

  export interface PluginLocaleMessages extends DefineMessageType<
    typeof buildPluginMessages
  > {}
}

const evolve = defineCommand('evolve', {
  description: 'plugins.evolvePlugin.description',
}).flags({
  evolveName: {
    type: String,
    default: 'evolveName',
    description: 'plugins.evolvePlugin.flags.evolveName',
  },
});

const migrate = defineCommand('migrate', {
  description: 'plugins.migratePlugin.description',
}).flags({
  migrateName: {
    type: String,
    default: 'evolveName',
    description: 'plugins.migratePlugin.flags.migrateName',
  },
});

const cli = createWizard({
  name: 'hps_cli',
  description: 'cli.helpCli.description',
  version: 'cli.helpCli.version',
  localeMessages: helpCliMessages,
  errorHandler: (e) => {
    console.log('CLI errorHandler \n', e);
  },
})
  .use(
    createHelpPlugin({
      showBanner: true,
      showFooter: true,
      overrideLocaleMessages: {
        en: {
          helpPlugin: {
            banner: '🎉🎉🎉Wizard cli is published by hps🎉🎉🎉',
            footer: '@2025 wizard-plugin-help English version',
          },
        },
        zh: {
          helpPlugin: {
            banner: '🎉🎉🎉Wizard cli 正在发布🎉🎉🎉',
            footer: '@2025 wizard-plugin-help 中文版本',
          },
        },
      },
    })
  )
  .use(
    definePlugin({
      name: () => 'test plugin',
      localeMessages: buildPluginMessages,
      setup: (cli) => {
        return cli.register(
          defineCommand('build', {
            description: 'plugins.buildPlugin.description',
            example: 'plugins.buildPlugin.example',
            help: 'plugins.buildPlugin.help',
          })
            .flags({
              projectCwd: {
                type: String,
                default: 'projectCwd',
                alias: 'p',
                description: 'plugins.buildPlugin.flags.projectCwd',
              },
              type: {
                type: Boolean,
                alias: 't',
                required: true,
                default: true,
                description: 'plugins.buildPlugin.flags.type',
              },
              timeout: {
                type: Number,
                description: 'plugins.buildPlugin.flags.timeout',
              },
            })
            .use(evolve, migrate)
        );
      },
    })
  )
  .use(
    definePlugin({
      name: () => 'test plugin2',
      localeMessages: buildPluginMessages,
      setup: (cli) => {
        return cli.register(
          defineCommand('pack', {
            description: 'plugins.buildPlugin.description',
            example: 'plugins.buildPlugin.example',
            help: 'plugins.buildPlugin.help',
          })
            .flags({
              projectCwd: {
                type: String,
                default: 'projectCwd',
                alias: 'p',
                description: 'plugins.buildPlugin.flags.projectCwd',
              },
              type: {
                type: Boolean,
                alias: 't',
                required: true,
                default: true,
                description: 'plugins.buildPlugin.flags.type',
              },
              timeout: {
                type: Number,
                description: 'plugins.buildPlugin.flags.timeout',
              },
            })
            .use(evolve, migrate)
        );
      },
    })
  );
cli.parse(['build', 'evolve', '-h', '--noColor=false', '--logLevel=debug']);
// cli.parse(['-h']);
