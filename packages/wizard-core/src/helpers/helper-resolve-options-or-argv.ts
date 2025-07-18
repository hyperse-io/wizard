import type { ParseOptions } from '../types/type-wizard.js';
import { resolveArgv } from './helper-resolve-argv.js';

/**
 * Resolves the options or argv.
 *
 * @param optionsOrArgv The options or argv to resolve.
 * @returns The resolved options or argv.
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
