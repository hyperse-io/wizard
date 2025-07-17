import type { MapToCommandMapping, Wizard } from '../core/Wizard.js';

/**
 * @description
 * The plugin type.
 *
 * @docsCategory types
 * @docsPage Plugin
 */
export interface Plugin<
  CommandMapping extends MapToCommandMapping,
  Result extends MapToCommandMapping,
> {
  setup: (cli: Wizard<CommandMapping>) => Wizard<Result>;
}
