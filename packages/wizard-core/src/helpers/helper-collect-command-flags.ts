import type { Command, CommandName } from '../types/type-command.js';
import type { Flags } from '../types/type-flag.js';

/**
 * Collects and merges all flags from the given command list.
 *
 * @param commandList A list of Command instances.
 * @returns An object containing all merged flags from the commands.
 */
export const collectCommandFlags = <Name extends CommandName>(
  commandList: Command<Name>[]
): Flags => {
  let flags: Flags = {};
  for (const command of commandList) {
    const definedFlags = (command as Command<Name>).getFlags?.() || {};
    flags = { ...flags, ...definedFlags };
  }
  return flags;
};
