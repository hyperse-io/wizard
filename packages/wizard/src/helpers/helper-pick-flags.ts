import type { Flags, ParsedFlags, ParseFlags } from '../types/type-flag.js';

/**
 * Picks the flags from the given flags object.
 *
 * @param flags The parsed flag values to pick from.
 * @param targetFlags The flag definitions to pick the flags from.
 * @returns The picked flags object.
 */
export function pickFlags<PickFlagsResult extends Flags>(
  flags: ParsedFlags,
  targetFlags: Flags
): ParseFlags<PickFlagsResult> {
  return Object.keys(targetFlags).reduce((acc, flagName) => {
    acc[flagName] = flags[flagName];
    return acc;
  }, {} as ParsedFlags) as ParseFlags<PickFlagsResult>;
}
