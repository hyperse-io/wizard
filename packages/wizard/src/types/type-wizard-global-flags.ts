import type { Logger } from '@hyperse/logger';
import type { Flags, FlagsWithBuiltin, ParseFlags } from './type-flag.js';
import type { I18n, SupportedLocales } from './type-locale-messages.js';
import type { PipelineNextFunction } from './type-wizard-pipeline.js';

/**
 * @description
 * The parameters for the global flag handler.
 */
export type GlobalFlagHandlerContext<GlobalFlags extends Flags> = {
  /**
   * The parsed flags for the command.
   */
  flags: ParseFlags<GlobalFlags>;
  /**
   * The unknown flags for the command.
   */
  unknownFlags?: {
    [flagName: string]: (string | boolean)[];
  };
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
};

/**
 * @description
 * The handler for the global flag.
 */
export type GlobalInterceptorHandler<
  GlobalFlags extends Flags = FlagsWithBuiltin,
> = (
  ctx: GlobalFlagHandlerContext<GlobalFlags>,
  next: PipelineNextFunction
) => Promise<void> | void;
