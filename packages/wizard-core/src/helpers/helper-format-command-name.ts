import { rootName } from '../constants.js';
import type { RootType } from '../types/type-wizard.js';

/**
 * @description
 * Formats the command name.
 *
 * @param name The name of the command.
 * @returns The formatted command name.
 */
export const formatCommandName = (name: string | string[] | RootType) =>
  Array.isArray(name)
    ? name.join(' ')
    : typeof name === 'string'
      ? name
      : rootName;
