import { LogLevel } from '@hyperse/logger';
import { CommandInvalidFlagsValues } from '../errors/CommandInvalidFlagsValues.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { toPascalCase } from './helper-string.js';

const formatLogLevel = (
  level: keyof typeof LogLevel,
  locale: SupportedLocales
) => {
  if (typeof LogLevel[toPascalCase(level)] === 'undefined') {
    throw new CommandInvalidFlagsValues(locale, {
      flagName: 'logLevel',
      flagValue: level,
      flagValues: Object.keys(LogLevel)
        .filter((k) => isNaN(Number(k)))
        .join(', '),
    });
  }
  return level;
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
      type: (level: keyof typeof LogLevel) => formatLogLevel(level, locale),
      description: 'core.flags.logLevel',
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
