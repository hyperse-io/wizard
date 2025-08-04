import type { LogLevel } from '@hyperse/logger';
import type { Wizard } from '../core/Wizard.js';
import type { CommandNameToContext } from '../types/type-command-builder.js';
import type { Flags, FlagsWithBuiltin } from '../types/type-flag.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';

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
    const logLevel = inputFlags?.logLevel as unknown as LogLevel;
    const noColor = inputFlags?.noColor as unknown as boolean;
    if (typeof logLevel !== 'undefined' || typeof logLevel !== 'undefined') {
      wizard.setupLogger({
        logLevel: logLevel,
        noColor: noColor,
      });
    }
    await next();
  };
};
