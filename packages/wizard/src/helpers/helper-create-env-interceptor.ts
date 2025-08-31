import type { Flags, FlagsWithBuiltin } from '../types/type-flag.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';
import { loadDotenv } from './helper-load-dotenv.js';

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
    const env = inputFlags?.env as unknown as string;
    const envPath = inputFlags?.envPath as unknown as string;
    loadDotenv({
      env,
      envPath,
    });
    await next();
  };
};
