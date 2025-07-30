import type { StdoutOptions } from '@hyperse/logger-plugin-stdout';
import { definePlugin } from '@hyperse/wizard-core';
import { createErrorLogger } from './create-logger.js';
import { errorMessages } from './i18n/messages.js';

export type ErrorPluginOptions = Partial<StdoutOptions>;

/**
 * Create a plugin that logs errors to the console.
 * @param options - The options for the plugin.
 * @returns The plugin.
 */
export const createErrorPlugin = (options: ErrorPluginOptions = {}) => {
  const logger = createErrorLogger(options);
  return definePlugin({
    name: 'plugins.errorPlugin.name',
    localeMessages: errorMessages,
    setup: (wizard) => {
      return wizard.errorHandler((err: any) => {
        logger.error(err);
      });
    },
  });
};
