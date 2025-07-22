import { typeFlag } from 'type-flag';
import type { Flags } from '../types/type-flag.js';

/**
 * @description
 * Parses the flags from the given arguments.
 */
export type ParseFlagsResult<DefinedFlags extends Flags = Flags> = ReturnType<
  typeof parseFlags<DefinedFlags>
>;

/**
 * @description
 * Parses the flags from the given arguments.
 *
 * @param definedFlags The defined flags.
 * @param argvOptions The argv options.
 * @returns The parsed flags.
 */
export const parseFlags = <DefinedFlags extends Flags>(
  definedFlags: DefinedFlags,
  argvOptions: {
    argv: string[];
    run?: boolean;
  }
) => {
  const { argv } = argvOptions;
  const parsed = typeFlag(definedFlags, argv);
  const { _: args, flags, unknownFlags } = parsed;
  const eofArgs = args['--'];

  return {
    args: args,
    eofArgs,
    flags,
    unknownFlags,
  };
};
