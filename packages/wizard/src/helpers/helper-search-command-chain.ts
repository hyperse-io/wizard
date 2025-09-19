import { Root } from '../constants.js';
import type { Command, CommandName } from '../types/type-command.js';
import { formatCommandName } from './helper-format-command-name.js';
/**
 * Search the command chain.
 * Query from the child node to the root node
 *
 * @param name The name of the command to resolve.
 * @param commandMap The command map to resolve the command pipeline from.
 * @returns The command pipeline.
 */
export const searchCommandChain = <Name extends CommandName>(
  name: string,
  commandMap: Map<string, Command<Name>>
): Command<Name>[] => {
  const commandList: Command<Name>[] = [];

  const commandNames: string[] = name.split('.');
  while (commandNames.length > 0) {
    const command = commandMap.get(commandNames.join('.'));
    if (command) {
      commandList.push(command);
    }
    commandNames.pop();
  }

  const rootCommand = commandMap.get(formatCommandName(Root));
  if (name !== formatCommandName(Root) && rootCommand) {
    commandList.push(rootCommand);
  }
  commandList.reverse();
  return commandList;
};
