import { Root } from '../constants.js';
import type { Command, CommandName } from '../types/type-command.js';
import { formatCommandName } from './helper-format-command-name.js';

/**
 * @description
 * Searches for the event name.
 *
 * @example
 * ```ts
 * const eventName = searchEventName(currentCommand, commands);
 * console.log(eventName); // 'build.evolve.mini'
 * ```
 *
 * @param currentCommand The current command.
 * @param commands The commands.
 * @returns The event name.
 */
export const searchEventName = <Name extends CommandName>(
  currentCommand: Command<Name>,
  commands: Command<Name>[] = []
): string => {
  const names: string[] = [];
  const eventName = currentCommand.name;
  for (const cmd of commands) {
    const cmdName = cmd.name;
    if (cmdName === Root) {
      continue;
    }

    names.push(formatCommandName(cmdName));

    if (cmdName === eventName) {
      return names.join('.');
    }
  }
  return '';
};
