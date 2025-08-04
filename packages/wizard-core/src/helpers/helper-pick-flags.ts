import type { Flags } from '../types/type-flag.js';

/**
 * Picks the flags from the given flags object.
 *
 * @param flags The flags object to pick from.
 * @param targetFlags The flags object to pick the flags from.
 * @returns The picked flags object.
 */
export function pickFlags(flags: Flags, targetFlags: Flags): Flags {
  return Object.keys(targetFlags).reduce((acc, flagName) => {
    acc[flagName] = flags[flagName];
    return acc;
  }, {} as Flags);
}
