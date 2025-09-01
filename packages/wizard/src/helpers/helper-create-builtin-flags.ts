import { LogLevel } from '@hyperse/logger';
import { CommandInvalidFlagsValues } from '../errors/CommandInvalidFlagsValues.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';

const formatLogLevel = (level: LogLevel, locale: SupportedLocales) => {
  const levelStr = level.toString();
  const firstChar = levelStr.charAt(0);
  const pascalCase = firstChar.toUpperCase() + levelStr.slice(1);
  const logLevel = LogLevel[pascalCase as keyof typeof LogLevel];
  if (typeof logLevel === 'undefined') {
    throw new CommandInvalidFlagsValues(locale, {
      flagName: 'logLevel',
      flagValue: level,
      flagValues: Object.keys(LogLevel)
        .filter((k) => isNaN(Number(k)))
        .join(', '),
    });
  }
  return logLevel;
};

/**
 * @description
 * Create the builtin flags.
 *
 * @example
 * ```ts
 * const flags = createBuiltinFlags('en');
 * ```
 *
 * @param locale The locale.
 * @returns The builtin flags.
 */
export const createBuiltinFlags = (locale: SupportedLocales) => {
  return {
    noColor: {
      type: Boolean,
      description: 'core.flags.noColor',
      default: false,
    },
    logLevel: {
      type: (level: LogLevel) => formatLogLevel(level, locale),
      description: 'core.flags.logLevel',
      default: formatLogLevel(LogLevel.Info, locale),
    },
    hpsAppEnv: {
      type: String,
      description: 'core.flags.hpsAppEnv',
      default: 'APP_ENV',
    },
    hpsEnvPath: {
      type: String,
      description: 'core.flags.hpsEnvPath',
    },
  };
};
