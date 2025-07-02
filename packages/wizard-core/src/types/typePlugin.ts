import type { Wizard } from '../core/Wizard.js';

/**
 * @description
 * The plugin type.
 *
 * @docsCategory types
 * @docsPage Plugin
 */
export interface Plugin<T extends Wizard = Wizard> {
  setup: (cli: T) => T;
}
