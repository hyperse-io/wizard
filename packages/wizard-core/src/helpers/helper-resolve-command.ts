import { typeFlag } from 'type-flag';
import { Root } from '../constants.js';
import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { ParseOptions } from '../types/type-argv.js';
import type { Command, CommandName } from '../types/type-command.js';
import type { FlagsWithBuiltin } from '../types/type-flag.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { formatCommandName } from './helper-format-command-name.js';

export function resolveCommand(
  locale: SupportedLocales,
  commandMap: Map<CommandName, Command<CommandName>>,
  argvOptions: ParseOptions,
  globalFlags: FlagsWithBuiltin
): [Command<CommandName> | undefined, CommandName | undefined] {
  const { argv } = argvOptions;
  let calledCommandName: CommandName | undefined;
  for (const [name, command] of commandMap.entries()) {
    const mergedFlags = { ...globalFlags, ...(command.flags ?? {}) };
    const parsed = typeFlag(mergedFlags, [...(argv ?? [])]);
    const { _: args } = parsed;
    if (name === Root) {
      continue;
    }

    const lastArg = args.pop();
    calledCommandName = lastArg;
    if (lastArg && lastArg === name) {
      return [command, name];
    }
  }

  if (calledCommandName) {
    throw new CommandNotFoundError(locale, {
      cmdName: formatCommandName(calledCommandName),
    });
  }

  if (commandMap.has(Root)) {
    return [commandMap.get(Root)!, Root];
  }

  return [undefined, undefined];
}
