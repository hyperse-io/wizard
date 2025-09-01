import { setupEnv } from '@hyperse/hyper-env/setup-env';
import type { Flags, FlagsWithBuiltin } from '../types/type-flag.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';

/**
 * @description
 * Create the env interceptor.
 *
 * @param wizard The wizard.
 * @returns The env interceptor.
 */
export const createEnvInterceptor = <
  GlobalFlags extends Flags = FlagsWithBuiltin,
>(): GlobalInterceptorHandler<GlobalFlags> => {
  return async (ctx, next) => {
    const inputFlags = ctx.flags;
    const hpsAppEnv = inputFlags?.hpsAppEnv as string;
    const hpsEnvPath = inputFlags?.hpsEnvPath as string;
    setupEnv({
      envKey: hpsAppEnv,
      envFilePath: hpsEnvPath || '',
    });
    await next();
  };
};
