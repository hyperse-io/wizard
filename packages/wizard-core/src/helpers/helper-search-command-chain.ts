import type { Command, CommandName } from '../types/type-command.js';

/**
 * Search the command chain.
 * Query from the child node to the root node
 *
 * @param name The name of the command to resolve.
 * @param commandMap The command map to resolve the command pipeline from.
 * @returns The command pipeline.
 */
export const searchCommandChain = <Name extends CommandName>(
  name: Name,
  commandMap: Map<Name, Command<Name>>
): Command<Name>[] => {
  const commandList: Command<Name>[] = [];
  let command = commandMap.get(name)!;
  if (!command) {
    return [];
  }
  commandList.push(command);

  while (command?.parentCommand) {
    const parentCommand: Command<Name> | undefined = command.parentCommand;
    if (parentCommand) {
      commandList.push(parentCommand);
      command = parentCommand;
    } else {
      break;
    }
  }

  commandList.reverse();
  return commandList;
};
