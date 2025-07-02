import { LogLevel } from '@hyperse/logger';

export abstract class CommandI18nError extends Error {
  protected constructor(
    public message: string,
    public logLevel: LogLevel = LogLevel.Warn
  ) {
    super(message);
  }
}
