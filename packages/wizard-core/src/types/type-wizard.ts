import type { Logger, LogLevel } from '@hyperse/logger';
import type { Root } from '../constants.js';
import type {
  CommandBasicInfoWithI18n,
  CommandContext,
} from './type-command.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { FlagOptions, Flags } from './type-flag.js';
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

export type GlobalFlagHandlerParameters<Name extends string = string> = {
  /**
   * The parsed flags for the command.
   */
  flags: Record<Name, FlagOptions>;
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
} & Omit<PipelineContext, 'ctx'>;

/**
 * @description
 * The global flags for the wizard.
 */
export type GlobalFlags = Map<
  string,
  FlagOptions & {
    handler?: (params: GlobalFlagHandlerParameters) => void;
  }
>;

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
   * The locale of the wizard.
   * @default system locale
   */
  locale?: SupportedLocales;
  /**
   * The name of the wizard.
   */
  name: CliLocaleMessageResolver;
  /**
   * The description of the wizard.
   */
  description: CliLocaleMessageResolver;
  /**
   * The version of the wizard.
   */
  version: CliLocaleMessageResolver;
  /**
   * The threshold log level.
   */
  thresholdLogLevel?: LogLevel;
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

/**
 * @description
 * The options for the parse method.
 *
 */
export type ParseOptions = {
  argv?: string[];
  run?: boolean;
};

/**
 * @description
 * The context for the pipeline.
 *
 */
export type PipelineContext = {
  /**
   * The arguments.
   */
  args: string[];
  /**
   * The end of file arguments.
   */
  eofArgs: string[];
  /**
   * The flags.
   */
  flags: Flags;
  /**
   * The unknown flags.
   */
  unknownFlags?: {
    [flagName: string]: (string | boolean)[];
  };
  /**
   * The context.
   */
  ctx?: CommandContext;
  /**
   * The options or arguments.
   */
  optionsOrArgv: string[] | ParseOptions;
};
