import type { Logger, LogLevel } from '@hyperse/logger';
import type { Root } from '../constants.js';
import type { CommandContext } from './type-command.js';
import type { CommandNameToContext } from './type-command-builder.js';
import type { Flags } from './type-flag.js';
import type {
  I18n,
  LocaleMessageResolver,
  LocaleMessagesKeys,
} from './type-locale-messages.js';

/**
 * @description
 * The root type of the wizard.
 *
 */
export type RootType = typeof Root;

export type WizardEventContext<NameToContext extends CommandNameToContext> = {
  [K in keyof NameToContext]: { ctx: NameToContext[K] } & {
    logger: Logger;
    locale: LocaleMessagesKeys;
    i18n: I18n;
  };
};

/**
 * @description
 * The options for the wizard.
 *
 */
export type WizardOptions = {
  name: LocaleMessageResolver;
  description: LocaleMessageResolver;
  version: LocaleMessageResolver;
  thresholdLogLevel?: LogLevel;
  noColor?: boolean;
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
 * @docsCategory types
 * @docsPage Pipeline Context
 */
export type PipelineContext = {
  args: string[];
  eofArgs: string[];
  flags: Flags;
  unknownFlags?: {
    [flagName: string]: (string | boolean)[];
  };
  ctx?: CommandContext;
  optionsOrArgv: string[] | ParseOptions;
};
