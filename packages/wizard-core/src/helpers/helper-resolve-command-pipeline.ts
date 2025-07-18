import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { Command } from '../types/type-command.js';
import type { RootType } from '../types/type-wizard.js';
import { formatCommandName } from './helper-validate-command-pipeline.js';

/**
 * Resolves the command pipeline.
 * Query from the child node to the root node
 *
 * @param locale The locale to use.
 * @param name The name of the command to resolve.
 * @param commandMap The command map to resolve the command pipeline from.
 * @returns The command pipeline.
 */
export const resolveCommandPipeline = <Name extends string | RootType>(
  locale: string,
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

  while (command.getParentCommand()) {
    const parentCommand = command.getParentCommand();
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
