import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { Command } from '../types/type-command.js';
import type { RootType } from '../types/type-wizard.js';

export const resolveCommandPipeline = <Name extends string | RootType>(
  locale: string,
  name: Name,
  commandMap: Record<Name, Command<Name>>
): Command<Name>[] => {
  const names: Name[] = [];
  const commandList: Command<Name>[] = [];
  let command = commandMap[name];
  if (!command) {
    throw new CommandNotFoundError(locale, {
      cmdName: String(name),
    });
  }
  commandList.push(command);
  names.push(command.getName());

  while (command.getParentCommand()) {
    const parentCommand = command.getParentCommand();
    if (parentCommand) {
      commandList.push(parentCommand);
      names.push(parentCommand.getName());
      command = parentCommand;
    } else {
      break;
    }
  }

  commandList.reverse();

  return commandList;
};
