import { Root } from '../constants.js';
import type { Command, CommandName } from '../types/type-command.js';
import { formatCommandName } from './helper-format-command-name.js';

/**
 * @description
 * Searches for the command name chain.
 *
 * @example
 * ```ts
 * const commandNameChain = searchCommandNameChain(currentCommand, commands);
 * console.log(commandNameChain); // ['build', 'evolve', 'mini']
 * ```
 *
 * @param currentCommand The current command.
 * @param commands The commands.
 * @returns The command name chain.
 */
export const searchCommandNameChain = <Name extends CommandName>(
  commands: Command<Name>[] = []
): string[] => {
  const names: string[] = [];
  for (const cmd of commands) {
    const cmdName = cmd.name;
    if (cmdName === Root) {
      continue;
    }
    names.push(formatCommandName(cmdName));
  }
  return names;
};
