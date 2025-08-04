import { rootName } from '../constants.js';
import type { CommandName } from '../types/type-command.js';

/**
 * @description
 * Formats the command name.
 *
 * @param name The name of the command.
 * @returns The formatted command name.
 */
export const formatCommandName = (name: CommandName) =>
  typeof name === 'string' ? name : rootName;
