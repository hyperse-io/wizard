import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from './type-command-builder.js';

/**
 * @description
 * The plugin type.
 *
 * @docsCategory types
 * @docsPage Plugin
 */
export interface Plugin<
  NameToContext extends CommandNameToContext,
  Result extends CommandNameToContext,
> {
  setup: (cli: Wizard<NameToContext>) => Wizard<Result>;
}
