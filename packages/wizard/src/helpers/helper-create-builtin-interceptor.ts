import { LogLevel } from '@hyperse/logger';
import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from '../types/type-command-builder.js';
import type { Flags, FlagsWithBuiltin } from '../types/type-flag.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';
import { toPascalCase } from './helper-string.js';

/**
 * @description
 * Create the builtin interceptor.
 *
 * @param wizard The wizard.
 * @returns The builtin interceptor.
 */
export const createBuiltinInterceptor = <
  NameToContext extends CommandNameToContext = {},
  GlobalFlags extends Flags = FlagsWithBuiltin,
>(
  wizard: Wizard<NameToContext, GlobalFlags>
): GlobalInterceptorHandler<GlobalFlags> => {
  return async (ctx, next) => {
    const inputFlags = ctx.flags;
    const logLevel = inputFlags?.logLevel as keyof typeof LogLevel;
    const noColor = inputFlags?.noColor as boolean;
    if (typeof logLevel !== 'undefined' || typeof noColor !== 'undefined') {
      wizard.setupLogger({
        logLevel: logLevel ? LogLevel[toPascalCase(logLevel)] : undefined,
        noColor: noColor,
      });
    }
    await next();
  };
};
