import didyoumean from 'didyoumean2';
import { CommandNotFoundError, formatCommandName } from '@hyperse/wizard';
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
 */
export const createErrorPlugin = (options?: ErrorPluginOptions) => {
  const { exitProcess = true } = options || {};
  return definePlugin({
    name: 'plugins.errorPlugin.name',
    localeMessages: errorMessages,
    setup: (wizard, pluginCtx) => {
      const cli = wizard.errorHandler(async (err: any) => {
        try {
          const { t } = wizard.i18n;
          const commandMap = wizard.commandMap;
          const commandKeys = Array.from(commandMap?.keys() ?? []);
          const finalCommandKeys = commandKeys.filter(
            (key) => key !== formatCommandName(Root)
          );
          const hasCommands = finalCommandKeys.length > 0;

          if (err instanceof CommandNotFoundError && hasCommands) {
            const closestCommandName = didyoumean(
              err?.variables?.cmdName as string,
              finalCommandKeys
            );
            if (closestCommandName) {
              await pluginCtx.logger.error(
                t('plugins.errorPlugin.messages.commandNotFound', {
                  cmdName: err.variables.cmdName,
                  closestCommandName: closestCommandName.replace(/\./g, ' '),
                })
              );
            } else {
              // No close match; still report the original error.
              await pluginCtx.logger.error(err);
            }
          } else {
            await pluginCtx.logger.error(err);
          }
        } catch (error: any) {
          await pluginCtx.logger.error(error);
        } finally {
          if (exitProcess) {
            process.exit(1);
          }
        }
      });
      return cli;
    },
  });
};
