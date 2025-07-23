import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { Command, CommandName } from '../types/type-command.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { formatCommandName } from './helper-format-command-name.js';

/**
 * Search the command chain.
 * Query from the child node to the root node
 *
 * @param locale The locale to use.
 * @param name The name of the command to resolve.
 * @param commandMap The command map to resolve the command pipeline from.
 * @returns The command pipeline.
 */
export const searchCommandChain = <Name extends CommandName>(
  locale: SupportedLocales,
  name: Name,
  commandMap: Record<Name, Command<Name>>
): Command<Name>[] => {
  const commandList: Command<Name>[] = [];
  let command = commandMap[name];
  if (!command) {
    throw new CommandNotFoundError(locale, {
      cmdName: formatCommandName(name),
    });
  }
  commandList.push(command);

  while (command.parentCommand) {
    const parentCommand = command.parentCommand;
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
