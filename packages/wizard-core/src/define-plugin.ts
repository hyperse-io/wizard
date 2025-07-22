import type { CommandNameToContext } from './types/type-command-builder.js';
import type { Plugin } from './types/type-plugin.js';

/**
 * @description
 * Define a plugin.
 *
 * @example
 * ```ts
 * export default definePlugin({
 *   name: 'my-plugin',
 *   setup: (wizard) => {
 *     return wizard.register(command);
 *   },
 * });
 * ```
 * @param plugin - The plugin to define.
 * @returns The plugin.
 */
export const definePlugin = <
  CommandMapping extends CommandNameToContext,
  Result extends CommandNameToContext,
>(
  plugin: Plugin<CommandMapping, Result>
) => plugin;
