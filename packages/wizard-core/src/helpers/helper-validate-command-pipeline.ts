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
 * Validate the command pipeline.
 *
 * @param locale The locale to use.
 * @param inputNameList The input name list to validate.
 * @param commandPipeline The command pipeline to validate.
 * @returns True if the command pipeline is valid, false otherwise.
 */
export const validateCommandPipeline = <Name extends CommandName>(
  locale: SupportedLocales,
  inputCommandFlags: Flags,
  inputNameList?: Name | string[],
  parsedFlags?: ParseFlagsResult,
  commandPipeline: Command<Name>[] = []
) => {
  if (!inputNameList) {
    return true;
  }

  const inputNameListString = formatCommandName(inputNameList);

  if (!commandPipeline || commandPipeline.length === 0) {
    throw new CommandNotConfigurationError(locale, {
      cmdName: inputNameListString,
    });
  }

  const pipelineNames = commandPipeline
    .map((command) => command.name)
    .filter((name: CommandName) => {
      return name !== Root;
    });

  if (pipelineNames.length === 0) {
    throw new CommandNotConfigurationError(locale, {
      cmdName: inputNameListString,
    });
  }

  if (inputNameListString !== pipelineNames.join(' ')) {
    throw new CommandNotFoundError(locale, {
      cmdName: inputNameListString,
    });
  }

  const flags = parsedFlags?.flags;
  if (inputCommandFlags) {
    for (const [flatName, flatOption] of Object.entries(inputCommandFlags)) {
      if (flatOption.required && typeof flags?.[flatName] === 'undefined') {
        throw new CommandFlagNotProviderError(locale, {
          cmdName: inputNameListString,
          flagName: flatName,
        });
      }
    }
  }

  return true;
};
