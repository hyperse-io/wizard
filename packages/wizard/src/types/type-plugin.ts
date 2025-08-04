import type { Logger, LogLevel } from '@hyperse/logger';
import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { Flags } from './type-flag.js';
import type {
  LocaleMessageResolver,
  LocaleMessagesPluginsObject,
} from './type-locale-messages.js';

export type PluginContext = {
  /**
   * The name of the plugin.
   */
  name?: string;
  /**
   * The threshold log level.
   */
  logLevel: LogLevel;
  /**
   * The logger instance provided by the wizard core.
   */
  logger: Logger;
  /**
   * Whether to use color.
   */
  noColor: boolean;
};

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
  NameToContext extends CommandNameToContext = {},
  Result extends CommandNameToContext = {},
  GlobalFlags extends Flags = Flags,
> {
  name: LocaleMessageResolver;
  localeMessages?: LocaleMessagesPluginsObject;
  setup: (
    cli: Wizard<NameToContext, GlobalFlags>,
    ctx: PluginContext
  ) => Wizard<Result, GlobalFlags>;
}
