import didyoumean from 'didyoumean2';
import type { CommandNotFoundError } from '@hyperse/wizard';
import { definePlugin, Root } from '@hyperse/wizard';
import { errorMessages } from './i18n/messages.js';

export type ErrorPluginOptions = {
  /**
   * Whether to exit the process when an error occurs.
   *
   * @default true
   */
  exitProcess?: boolean;
};

/**
 * Create a plugin that logs errors to the console.
 * @param options - The options for the plugin.
 * @returns The plugin.
 */
export const createErrorPlugin = (options?: ErrorPluginOptions) => {
  const { exitProcess = true } = options || {};
  return definePlugin({
    name: 'plugins.errorPlugin.name',
    localeMessages: errorMessages,
    setup: (wizard, pluginCtx) => {
      return wizard.errorHandler((err: CommandNotFoundError) => {
        try {
          const { t } = wizard.i18n;
          const commandMap = wizard.commandMap;
          const commandKeys = Array.from(commandMap?.keys() ?? []);
          const finalCommandKeys = commandKeys.filter((key) => key !== Root);
          const hasCommands = finalCommandKeys.length > 0;

          const closestCommandName = didyoumean(
            err.variables.cmdName as string,
            finalCommandKeys
          );
          if (hasCommands && closestCommandName) {
            pluginCtx.logger.error(
              t('plugins.errorPlugin.messages.commandNotFound', {
                cmdName: err.variables.cmdName,
                closestCommandName,
              })
            );
          } else {
            pluginCtx.logger.error(err);
          }
        } catch (error: any) {
          pluginCtx.logger.error(error);
        } finally {
          if (exitProcess) {
            setTimeout(() => process.exit(1), 100);
          }
        }
      });
    },
  });
};
