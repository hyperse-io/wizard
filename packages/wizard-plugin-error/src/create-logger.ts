import { createLogger, LogLevel } from '@hyperse/logger';
import {
  createStdoutPlugin,
  type StdoutOptions,
} from '@hyperse/logger-plugin-stdout';
import { ErrorLoggerName } from './constants.js';

export const createErrorLogger = (options: StdoutOptions) => {
  return createLogger({
    name: ErrorLoggerName,
    thresholdLevel: LogLevel.Error,
  })
    .use(createStdoutPlugin(options))
    .build();
};
