import { IS_DENO, IS_ELECTRON, IS_NODE } from 'is-platform';

/**
 * @description
 * Resolve the argv from the platform.
 *
 * @docsCategory utils
 * @docsPage Resolve Argv
 * @returns The argv from the platform.
 */
export const resolveArgv = (): string[] =>
  IS_NODE
    ? process.argv.slice(IS_ELECTRON ? 1 : 2)
    : IS_DENO
      ? // @ts-expect-error Ignore
        Deno.args
      : [];
