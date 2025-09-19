import { Root } from '../constants.js';
import { CommandFlagNotProviderError } from '../errors/CommandFlagNotProviderError.js';
import { CommandNotConfigurationError } from '../errors/CommandNotConfiguration.js';
import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { Command, CommandName } from '../types/type-command.js';
import type { Flags } from '../types/type-flag.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { formatCommandName } from './helper-format-command-name.js';
import type { ParseFlagsResult } from './helper-parse-flags.js';

/**
 * @description
 * Validate the command chain.
 *
 * @param locale The locale to use.
 * @param inputNameList The input name list to validate.
 * @param commandPipeline The command pipeline to validate.
 * @returns True if the command pipeline is valid, false otherwise.
 */
export const validateCommandChain = <Name extends CommandName>(
  locale: SupportedLocales,
  inputCommandFlags: Flags,
  parsedFlags: ParseFlagsResult,
  commandChain: Command<Name>[] = []
) => {
  const inputNames = parsedFlags.args;

  const commandChainNames = commandChain.map((command) =>
    formatCommandName(command.name)
  );

  const inputNamesStr = inputNames
    .filter((name) => name !== formatCommandName(Root))
    .join(' ');

  const commandChainNamesStr = commandChainNames
    .filter((name) => name !== formatCommandName(Root))
    .join(' ');

  //If commandChain not config other command without Root, throw error
  if (
    commandChainNames.filter((name) => name !== formatCommandName(Root))
      .length === 0
  ) {
    throw new CommandNotConfigurationError(locale, {
      cmdName: inputNamesStr,
    });
  }

  if (inputNamesStr !== commandChainNamesStr) {
    throw new CommandNotFoundError(locale, {
      cmdName: inputNamesStr,
    });
  }

  const flags = parsedFlags?.flags ?? {};
  if (inputCommandFlags) {
    for (const [flatName, flatOption] of Object.entries(inputCommandFlags)) {
      if (flatOption.required && typeof flags?.[flatName] === 'undefined') {
        throw new CommandFlagNotProviderError(locale, {
          cmdName: inputNamesStr,
          flagName: flatName,
        });
      }
    }
  }
  return true;
};

/**
 * @description
 * Validate the command name.
 *
 * @example
 * ```ts
 * validateCommandName('help'); // true
 * validateCommandName('help '); // false
 * validateCommandName(' help'); // false
 * validateCommandName('help  '); // false
 * ```
 * @param name The command name to validate.
 * @returns True if the command name is valid, false otherwise.
 */
export const validateCommandName = (name: string) =>
  name === formatCommandName(Root)
    ? true
    : !(name.startsWith(' ') || name.endsWith(' ')) && !/\s{2,}/.test(name);
