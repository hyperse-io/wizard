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
  commandMap: Map<string, Command<CommandName>>,
  argvOptions: ParseOptions,
  globalFlags: FlagsWithBuiltin
): [Command<CommandName> | undefined, string | undefined] {
  const { argv } = argvOptions;
  let calledCommandName: string[] = [];
  for (const [name, command] of commandMap.entries()) {
    const cmdName = name.split('.').pop();
    const mergedFlags = { ...globalFlags, ...(command.flags ?? {}) };
    const parsed = typeFlag(mergedFlags, [...(argv ?? [])]);
    const { _: args } = parsed;
    if (!cmdName || cmdName === formatCommandName(Root)) {
      continue;
    }

    const argsStr = args.join('.');
    calledCommandName = [...args];
    if (args && argsStr === name) {
      return [command, name];
    }
  }

  if (calledCommandName.length > 0) {
    throw new CommandNotFoundError(locale, {
      cmdName: calledCommandName.join(' '),
    });
  }

  if (commandMap.has(formatCommandName(Root))) {
    return [commandMap.get(formatCommandName(Root))!, formatCommandName(Root)];
  }

  return [undefined, undefined];
}
