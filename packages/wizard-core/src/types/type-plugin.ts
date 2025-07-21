import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { LocaleMessagesObjectWithoutDefault } from './type-locale-messages.js';

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
  localeMessages?: LocaleMessagesObjectWithoutDefault;
  setup: (cli: Wizard<NameToContext>) => Wizard<Result>;
}
