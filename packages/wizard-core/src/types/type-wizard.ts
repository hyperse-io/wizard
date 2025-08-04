import type { Logger, LogLevel } from '@hyperse/logger';
import type { Root } from '../constants.js';
import type { CommandBasicInfoWithI18n } from './type-command.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type {
  CliLocaleMessageResolver,
  I18n,
  LocaleMessagesCliObject,
  SupportedLocales,
} from './type-locale-messages.js';

/**
 * @description
 * The root type of the wizard.
 *
 */
export type RootType = typeof Root;

/**
 * @description
 * The event context for the wizard.
 *
 * @template NameToContext - The type of the command name to context.
 * @returns {WizardEventContext} The event context.
 */
export type WizardEventContext<NameToContext extends CommandNameToContext> = {
  [K in keyof NameToContext]: { ctx: NameToContext[K] } & {
    /**
     * Logger instance for outputting logs within the handler.
     */
    logger: Logger;
    /**
     * The current locale key for i18n messages.
     */
    locale: SupportedLocales;
    /**
     * I18n instance for retrieving localized messages.
     */
    i18n: I18n;
  } & CommandBasicInfoWithI18n;
};

/**
 * @description
 * The options for the wizard.
 */
export type WizardOptions = {
  /**
   * The name of the wizard.
   */
  name: string;
  /**
   * The description of the wizard.
   */
  description: CliLocaleMessageResolver;
  /**
   * The version of the wizard.
   */
  version: CliLocaleMessageResolver;
  /**
   * The locale of the wizard.
   * @default system locale
   */
  locale?: SupportedLocales;
  /**
   * The threshold log level.
   */
  logLevel?: LogLevel;
  /**
   * Whether to use color.
   */
  noColor?: boolean;
  /**
   * The override messages.
   *
   */
  localeMessages?: LocaleMessagesCliObject;
  /**
   * The error handler.
   */
  errorHandler?: (err: unknown) => void;
};
