import { Root } from '../constants.js';
import { CommandNotConfigurationError } from '../errors/CommandNotConfiguration.js';
import { CommandNotFoundError } from '../errors/CommandNotFoundError.js';
import type { Command } from '../types/type-command.js';
import type { LocaleMessagesKeys } from '../types/type-locale-messages.js';
import type { RootType } from '../types/type-wizard.js';

/**
 * @description
 * Validate the command pipeline.
 *
 * @param locale The locale to use.
 * @param inputNameList The input name list to validate.
 * @param commandPipeline The command pipeline to validate.
 * @returns True if the command pipeline is valid, false otherwise.
 */
export const validateCommandPipeline = <Name extends string | RootType>(
  locale: LocaleMessagesKeys,
  inputNameList?: Name | string[],
  commandPipeline?: Command<Name>[]
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
    .map((command) => command.getName())
    .filter((name: string | RootType) => {
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

  return true;
};

const INVALID_RE = /\s{2,}/;

export const isValidName = (name: string | RootType) =>
  name === Root
    ? true
    : !(name.startsWith(' ') || name.endsWith(' ')) && !INVALID_RE.test(name);

const ROOT = '<Root>';

export const formatCommandName = (name: string | string[] | RootType) =>
  Array.isArray(name) ? name.join(' ') : typeof name === 'string' ? name : ROOT;
