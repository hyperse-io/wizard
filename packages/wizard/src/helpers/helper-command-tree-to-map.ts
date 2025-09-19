import { Root } from '../constants.js';
import type { Command, CommandName } from '../types/type-command.js';
import type { CommandBuilder } from '../types/type-command-builder.js';
import { formatCommandName } from './helper-format-command-name.js';

/**
 * Collects and merges all command maps from the given root command builder.
 *
 * @param rootCommandBuilder The root command builder to collect command maps from.
 * @returns A mapping from command names to Command instances.
 */
export const commandTreeToMap = <Name extends CommandName>(
  rootCommandBuilder: CommandBuilder<Name>
): Map<string, Command<Name>> => {
  const commandMap: Map<string, Command<Name>> = new Map();
  function collectCommandMapFromCommand(
    command: Command<Name>,
    parentCommandName?: string
  ): any {
    let commandName = '';
    if (!parentCommandName) {
      commandName = formatCommandName(command.name);
    } else if (parentCommandName === formatCommandName(Root)) {
      commandName = `${formatCommandName(command.name)}`;
    } else {
      commandName = `${parentCommandName}.${formatCommandName(command.name)}`;
    }

    commandMap.set(commandName, command);
    const subCommands = command.subCommands || [];
    for (const subCmd of subCommands) {
      collectCommandMapFromCommand(subCmd, commandName);
    }
    return commandMap;
  }
  return collectCommandMapFromCommand(rootCommandBuilder.getCommand());
};
