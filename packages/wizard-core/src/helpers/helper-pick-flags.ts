import type { Flags } from '../types/type-flag.js';

export function pickFlags(flags: Flags, targetFlags: Flags): Flags {
  return Object.keys(targetFlags).reduce((acc, flagName) => {
    acc[flagName] = flags[flagName];
    return acc;
  }, {} as Flags);
}
