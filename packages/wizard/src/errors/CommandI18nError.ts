import { LogLevel } from '@hyperse/logger';

/**
 * @description
 * This is the base class for all i18n errors.
 *
 * @example
 * throw new CommandI18nError();
 */
export abstract class CommandI18nError extends Error {
  protected constructor(
    public message: string,
    public logLevel: LogLevel = LogLevel.Warn
  ) {
    super(message);
  }
}
