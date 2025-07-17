import type { Command } from '../types/type-command.js';
import type { Flags } from '../types/type-flag.js';
import type { RootType } from '../types/type-wizard.js';

export const collectCommandFlags = <Name extends string | RootType>(
  commandMap: Record<Name, Command<Name>>
): Flags => {
  let flags: Flags = {};
  for (const command of Object.values(commandMap)) {
    const definedFlags = (command as Command<Name>).getFlags?.() || {};
    flags = { ...flags, ...definedFlags };
  }
  return flags;
};
