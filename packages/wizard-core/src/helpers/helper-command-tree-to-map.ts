import type { Command, CommandName } from '../types/type-command.js';
import type { CommandBuilder } from '../types/type-command-builder.js';

/**
 * Collects and merges all command maps from the given root command builder.
 *
 * @param rootCommandBuilder The root command builder to collect command maps from.
 * @returns A mapping from command names to Command instances.
 */
export const commandTreeToMap = <Name extends CommandName>(
  rootCommandBuilder: CommandBuilder<Name>
): Map<Name, Command<Name>> => {
  const commandMap: Map<Name, Command<Name>> = new Map();
  function collectCommandMapFromCommand(command: Command<Name>): any {
    commandMap.set(command.name, command);
    const subCommands = command.subCommands || [];
    for (const subCmd of subCommands) {
      collectCommandMapFromCommand(subCmd);
    }
    return commandMap;
  }
  return collectCommandMapFromCommand(rootCommandBuilder.getCommand());
};
