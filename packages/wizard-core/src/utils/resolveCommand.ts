import { typeFlag } from 'type-flag';
import { Root } from '../constants.js';
import { CommandNameConflictError } from '../errors/CommandNameConflictError.js';
import type { Command, CommandAlias, Commands } from '../types/typeCommand.js';
import type { RootType } from '../types/typeWizard.js';
import { arrayStartsWith, toArray } from './toArray.js';

function setCommand(
  commandsMap: Map<string[] | RootType, CommandAlias>,
  commands: Commands,
  command: Command,
  locale: string
) {
  if (command.alias) {
    const aliases = toArray(command.alias);
    for (const alias of aliases) {
      if (alias in commands) {
        throw new CommandNameConflictError(locale, {
          newCmdName: commands[alias]!.name,
          oldCmdName: command.name,
        });
      }
      commandsMap.set(typeof alias === 'symbol' ? alias : alias.split(' '), {
        ...command,
        __isAlias: true,
      });
    }
  }
}

export function resolveFlattenCommands(commands: Commands, locale: string) {
  const commandsMap = new Map<string[] | RootType, CommandAlias>();
  if (commands[Root]) {
    commandsMap.set(Root, commands[Root]);
    setCommand(commandsMap, commands, commands[Root], locale);
  }
  for (const command of Object.values(commands)) {
    setCommand(commandsMap, commands, command, locale);
    commandsMap.set(command.name.split(' '), command);
  }

  return commandsMap;
}

export function resolveCommand(
  commands: Commands,
  argv: string[],
  locale: string
): [Command<string | RootType> | undefined, string[] | RootType | undefined] {
  const commandsMap = resolveFlattenCommands(commands, locale);
  for (const [name, command] of commandsMap.entries()) {
    const parsed = typeFlag(command?.flags ?? Object.create(null), [...argv]);
    const { _: args } = parsed;
    if (name === Root) {
      continue;
    }
    if (arrayStartsWith(args, name)) {
      return [command, name];
    }
  }
  if (commandsMap.has(Root)) {
    return [commandsMap.get(Root)!, Root];
  }

  return [undefined, undefined];
}
