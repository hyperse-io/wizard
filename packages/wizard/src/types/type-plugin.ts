import type { Logger, LogLevel } from '@hyperse/logger';
import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { Flags, FlagsWithBuiltin } from './type-flag.js';
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

export type PluginSetupWizard<
  NameToContext extends CommandNameToContext = {},
  GlobalFlags extends Flags = FlagsWithBuiltin,
> = Pick<
  Wizard<NameToContext, GlobalFlags>,
  | 'commandChain'
  | 'commandMap'
  | 'description'
  | 'errorHandler'
  | 'flag'
  | 'globalFlags'
  | 'i18n'
  | 'interceptor'
  | 'locale'
  | 'name'
  | 'register'
  | 'version'
>;

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
  GlobalFlags extends Flags = FlagsWithBuiltin,
  ExtendedGlobalFlags extends Flags = GlobalFlags,
> {
  /**
   * The name of the plugin.
   */
  name: LocaleMessageResolver;

  /**
   * The locale messages provided by the plugin.
   */
  localeMessages?: LocaleMessagesPluginsObject;
  /**
   * The setup method of the plugin.
   * This function is called when the plugin is registered with the Wizard instance.
   * It receives the current Wizard instance and the plugin context, and should return a (possibly extended) Wizard instance.
   */
  setup: (
    cli: PluginSetupWizard<NameToContext, GlobalFlags>,
    ctx: PluginContext
  ) => PluginSetupWizard<Result, ExtendedGlobalFlags>;
}
