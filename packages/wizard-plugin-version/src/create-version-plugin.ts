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

  /**
   * Whether to print the version with not hidden `v` prefix.
   *
   * @default false
   */
  hiddenPrefix?: boolean;
}

export const createVersionPlugin = (options: VersionPluginOptions = {}) => {
  return definePlugin({
    name: 'plugins.versionPlugin.name',
    localeMessages: versionMessages,
    setup: (wizard) => {
      const { flag = true, hiddenPrefix = false } = options;
      const gracefullyVersion = gracefulVersion(wizard.version, hiddenPrefix);
      let cli = wizard.register(
        defineCommand('version', {
          description: 'plugins.versionPlugin.command.description',
        }).handler(() => {
          process.stdout.write(gracefullyVersion);
          process.stdout.write('\n');
        })
      );

      if (flag) {
        cli = cli
          .flag('version', {
            type: Boolean,
            description: 'plugins.versionPlugin.flags.version',
            default: false,
            alias: 'V',
          })
          .interceptor(async (ctx, next) => {
            if (ctx.flags.version) {
              process.stdout.write(gracefullyVersion);
              process.stdout.write('\n');
            } else {
              await next();
            }
          });
      }
      return cli;
    },
  });
};
