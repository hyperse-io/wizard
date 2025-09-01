import type { CommandNameToContext } from './types/type-command-builder.js';
import type { Flags, FlagsWithBuiltin } from './types/type-flag.js';
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
 */
export const definePlugin = <
  CommandMapping extends CommandNameToContext,
  Result extends CommandNameToContext,
  GlobalFlags extends Flags = FlagsWithBuiltin,
  ExtendedGlobalFlags extends Flags = GlobalFlags,
>(
  plugin: Plugin<CommandMapping, Result, GlobalFlags, ExtendedGlobalFlags>
) => plugin;
