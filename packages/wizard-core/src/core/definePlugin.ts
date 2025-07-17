import type { Plugin } from '../types/type-plugin.js';
import type { MapToCommandMapping } from './Wizard.js';

/**
 * @description
 * Define a plugin.
 *
 * @example
 * ```ts
 * export default definePlugin({
 *   name: 'my-plugin',
 *   setup: (wizard) => {
 *     return wizard;
 *   },
 * });
 * ```
 * @docsCategory core
 * @docsPage definePlugin
 * @param plugin - The plugin to define.
 * @returns The plugin.
 */
export const definePlugin = <
  CommandMapping extends MapToCommandMapping,
  Result extends MapToCommandMapping,
>(
  plugin: Plugin<CommandMapping, Result>
) => plugin;

// export function definePlugin<
//   Cli extends Wizard<any>,
//   Result extends Wizard<any>,
// >(plugin: Plugin<Cli, Result>): Plugin<Cli, Result>;

// export function definePlugin<
//   Cli extends Wizard<any>,
//   Result extends Wizard<any>,
// >(name: string, options: CommandBuilderOptions): Plugin<Cli, Result>;

// export function definePlugin(plugin: any): any {
//   return plugin;
// }
