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
 * Options for configuring a wizard instance.
 */
export type WizardOptions = {
  /**
   * The name of the CLI tool, shown in help and usage output.
   */
  name: string;
  /**
   * The description of the CLI tool, supports localization.
   * @remarks `locale message key` or `(t)=>t('locale message key')`
   * @example
   * ```tsx
   * wizard.description
   * ```
   * or
   * ```tsx
   * (t)=>t('wizard.description')
   * ```
   */
  description: CliLocaleMessageResolver;
  /**
   * The version of the CLI tool, supports localization.
   * @remarks `locale message key` or `(t)=>t('locale message key')`
   * @example
   * ```tsx
   * wizard.version
   * ```
   * or
   * ```tsx
   * (t)=>t('wizard.version')
   * ```
   */
  version: CliLocaleMessageResolver;
  /**
   * The default locale for CLI messages.
   * @default system locale
   */
  locale?: SupportedLocales;
  /**
   * The minimum log level to output. Logs below this level will be filtered out.
   *
   * @default LogLevel.Info
   */
  logLevel?: LogLevel;
  /**
   * Whether to disable colored log output.
   *
   * @default false
   */
  noColor?: boolean;
  /**
   * Custom or override messages for CLI localization.
   */
  localeMessages?: LocaleMessagesCliObject;
  /**
   * Global error handler, called when an uncaught exception occurs during CLI execution.
   */
  errorHandler?: (err: unknown) => void | Promise<void>;
};
