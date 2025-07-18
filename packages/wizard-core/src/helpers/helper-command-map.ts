import type { Command } from '../types/type-command.js';
import type { CommandBuilder } from '../types/type-command-builder.js';
import type { RootType } from '../types/type-wizard.js';

/**
 * Collects and merges all command maps from the given root command builder.
 *
 * @param rootCommandBuilder The root command builder to collect command maps from.
 * @returns A mapping from command names to Command instances.
 */
export const getAllCommandMap = <Name extends string | RootType>(
  rootCommandBuilder: CommandBuilder<Name>
): Record<Name, Command<Name>> => {
  let commandMap: Record<Name, Command<Name>> = {} as Record<
    Name,
    Command<Name>
  >;
  function collectCommandMapFromCommand(command: Command<Name>): any {
    commandMap[command.getName()] = command;
    const subCommands = command.getSubCommands?.() || [];
    for (const subCmd of subCommands) {
      commandMap = { ...commandMap, ...collectCommandMapFromCommand(subCmd) };
    }
    return commandMap;
  }
  return collectCommandMapFromCommand(rootCommandBuilder.getCommand());
};
