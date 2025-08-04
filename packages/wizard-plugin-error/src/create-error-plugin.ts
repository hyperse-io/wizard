import { definePlugin } from '@hyperse/wizard';
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
      return wizard.errorHandler((err: any) => {
        pluginCtx.logger.error(err);
        if (exitProcess) {
          setTimeout(process.exit(1), 100);
        }
      });
    },
  });
};
