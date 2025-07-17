import type { Command } from '../types/type-command.js';
import type { CommandBuilder } from '../types/type-command-builder.js';
import type { RootType } from '../types/type-wizard.js';

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
