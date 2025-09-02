import { simpleDeepClone } from '@hyperse/deep-merge';
import { setupEnv } from '@hyperse/hyper-env/setup-env';
import type { ParseOptions } from '../types/type-argv.js';
import type { FlagsWithBuiltin } from '../types/type-flag.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { createBuiltinFlags } from './helper-create-builtin-flags.js';
import { parseFlags } from './helper-parse-flags.js';

/**
 * @description
 * Sets up process environment variables (process.env) by automatically loading the appropriate .env file
 * based on built-in environment flags (such as --hpsAppEnv, --hpsEnvPath) from the command line arguments.

 * @param optionsOrArgv The parsed command line arguments or a ParseOptions object.
 * @param locale The current locale (used for built-in flag i18n support).
 */
export const setupProcessEnv = (
  optionsOrArgv: ParseOptions,
  locale: SupportedLocales
) => {
  const builtinFlags = createBuiltinFlags(locale) as FlagsWithBuiltin;
  const parsedFlags = parseFlags(builtinFlags, simpleDeepClone(optionsOrArgv));
  const inputFlags = parsedFlags.flags || {};
  const hpsAppEnv = inputFlags?.hpsAppEnv;
  const hpsEnvPath = inputFlags?.hpsEnvPath;
  setupEnv({
    envKey: hpsAppEnv,
    envFilePath: hpsEnvPath || '',
  });
};
