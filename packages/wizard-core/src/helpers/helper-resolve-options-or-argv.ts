import type { ParseOptions } from '../types/type-wizard.js';
import { resolveArgv } from './helper-resolve-argv.js';

/**
 * @description
 * Resolve the options from the platform.
 *
 * @docsCategory utils
 * @docsPage Resolve Options
 * @returns The options from the platform.
 */
export const resolveOptionsOrArgv = (
  optionsOrArgv: string[] | ParseOptions
) => {
  const parseOptions = Array.isArray(optionsOrArgv)
    ? { argv: optionsOrArgv, run: true }
    : {
        argv: resolveArgv(),
        ...optionsOrArgv,
      };
  return parseOptions;
};
