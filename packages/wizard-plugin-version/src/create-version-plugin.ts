import { defineCommand, definePlugin } from '@hyperse/wizard-core';
import { gracefulVersion } from './helpers/helper-graceful-version.js';
import { versionMessages } from './i18n/messages.js';

interface VersionPluginOptions {
  /**
   * Whether to register the global version flag.
   *
   * @default true
   */
  flag?: boolean;
}

export const createVersionPlugin = (options: VersionPluginOptions = {}) => {
  return definePlugin({
    name: 'plugins.versionPlugin.name',
    localeMessages: versionMessages,
    setup: (wizard) => {
      const { flag = true } = options;
      const gracefullyVersion = gracefulVersion(wizard.version);
      let cli = wizard.register(
        defineCommand('version', {
          description: 'plugins.versionPlugin.description',
          help: 'plugins.versionPlugin.help',
          example: 'plugins.versionPlugin.example',
        }).handler(() => {
          process.stdout.write(gracefullyVersion);
          process.stdout.write('\n');
        })
      );

      if (flag) {
        cli = cli.flag(
          'version',
          {
            type: Boolean,
            description: () => 'plugins.versionPlugin.versionDescription',
            default: false,
            alias: 'V',
          },
          (ctx) => {
            if (ctx.flags.version) {
              process.stdout.write(gracefullyVersion);
              process.stdout.write('\n');
            }
          }
        );
      }
      return cli;
    },
  });
};
