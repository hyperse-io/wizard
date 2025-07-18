import { Root } from '../constants.js';
import type { Command } from '../types/type-command.js';
import type { RootType } from '../types/type-wizard.js';
import { formatCommandName } from './helper-validate-command-pipeline.js';

export const searchEventName = <Name extends string | RootType>(
  currentCommand: Command<Name>,
  commands: Command<Name>[] = []
): string => {
  const names: string[] = [];
  const eventName = currentCommand.getName();
  for (const cmd of commands) {
    const cmdName = cmd.getName();
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
