import { Root } from '../constants.js';
import type {
  Command,
  CommandName,
  CommandWithI18n,
} from '../types/type-command.js';
import type { FlagsWithI18n } from '../types/type-flag.js';
import type {
  I18n,
  LocaleMessageResolverExtraOptions,
} from '../types/type-locale-messages.js';
import { formatCommandName } from './helper-format-command-name.js';
import { localeMessageValue } from './helper-locale-message-value.js';

export const i18nCommand = <Name extends CommandName>(
  t: I18n['t'],
  command: Command<Name>,
  extraOptions?: LocaleMessageResolverExtraOptions
) => {
  const flags = command?.flags ?? {};
  const i18nFlags: FlagsWithI18n = {};

  for (const [flagKey, flagValue] of Object.entries(flags)) {
    i18nFlags[flagKey] = {
      ...flagValue,
      description: localeMessageValue(t, flagValue.description, extraOptions),
    };
  }
  return {
    name: command.name,
    description: localeMessageValue(t, command.description, extraOptions),
    example: command.example
      ? localeMessageValue(t, command.example, extraOptions)
      : undefined,
    help: command.help
      ? localeMessageValue(t, command.help, extraOptions)
      : undefined,
    flags: i18nFlags,
    rawCommand: command,
  };
};

/**
 * @description
 * Converts a command map to a map of commands with i18n.
 *
 * @param t - The i18n instance.
 * @param commandMap - The command map to convert.
 * @param extraOptions - The extra options for the i18n.
 * @param excludeRoot - Whether to exclude the root command.
 */
export const commandMapWithI18n = (
  t: I18n['t'],
  commandMap: Map<string, Command<CommandName>>,
  extraOptions?: LocaleMessageResolverExtraOptions,
  excludeRoot: boolean = false
): Map<string, CommandWithI18n<CommandName>> => {
  const i18nCommandMap: Map<string, CommandWithI18n<CommandName>> = new Map();

  for (const [name, command] of commandMap.entries()) {
    if (excludeRoot && name === formatCommandName(Root)) {
      continue;
    }
    i18nCommandMap.set(name, i18nCommand(t, command, extraOptions));
  }
  return i18nCommandMap;
};

/**
 * @description
 * Converts a command chain to a chain of commands with i18n.
 *
 * @param t - The i18n instance.
 * @param commandChain - The command chain to convert.
 * @param extraOptions - The extra options for the i18n.
 * @param excludeRoot - Whether to exclude the root command.
 */
export const commandChainWithI18n = (
  t: I18n['t'],
  commandChain: Command<CommandName>[],
  extraOptions?: LocaleMessageResolverExtraOptions,
  excludeRoot: boolean = false
): CommandWithI18n<CommandName>[] => {
  const i18nCommandChain: CommandWithI18n<CommandName>[] = [];

  for (const command of commandChain) {
    if (excludeRoot && command.name === Root) {
      continue;
    }
    i18nCommandChain.push(i18nCommand(t, command, extraOptions));
  }

  return i18nCommandChain;
};
