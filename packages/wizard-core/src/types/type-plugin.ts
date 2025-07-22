import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { LocaleMessagesObjectWithoutDefault } from './type-locale-messages.js';

/**
 * @description
 * Plugin type definition. Describes the structure of a plugin, including optional locale messages (localeMessages)
 * and a required setup method. The setup method receives a Wizard instance and returns a new Wizard instance,
 * allowing the plugin to extend or modify the command context.
 *
 * @template NameToContext - The type of the command name to context.
 * @template Result - The type of the result.
 * @returns {Plugin} The plugin type.
 */
export interface Plugin<
  NameToContext extends CommandNameToContext,
  Result extends CommandNameToContext,
> {
  localeMessages?: LocaleMessagesObjectWithoutDefault;
  setup: (cli: Wizard<NameToContext>) => Wizard<Result>;
}
