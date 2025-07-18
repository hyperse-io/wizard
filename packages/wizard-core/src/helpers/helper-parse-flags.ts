import { typeFlag } from 'type-flag';
import type { Flags } from '../types/type-flag.js';
import type { InferFlagType } from '../types/type-flag.js';

/**
 * @description
 * Parses the flags from the given arguments.
 *
 * @docsCategory utils
 * @docsPage Parse Flags
 */
export type ParseFlagsResult<DefinedFlags extends Flags = Flags> = {
  args: string[];
  eofArgs: string[];
  flags: { [flag in keyof DefinedFlags]: InferFlagType<DefinedFlags[flag]> };
  unknownFlags: {
    [flagName: string]: (string | boolean)[];
  };
};

export const parseFlags = <DefinedFlags extends Flags>(
  definedFlags: DefinedFlags,
  argvOptions: {
    argv: string[];
    run?: boolean;
  }
): ParseFlagsResult<DefinedFlags> => {
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
