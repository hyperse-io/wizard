import type { Plugin } from '../types/typePlugin.js';
import type { Wizard } from './Wizard.js';

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
export const definePlugin = <T extends Wizard>(plugin: Plugin<T>) => plugin;
