import { createCommandBuilder } from './core/CommandBuilder.js';
import type { CommandContext } from './types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandBuilderOptions,
} from './types/type-command-builder.js';

/**
 * @description
 * Define a command.
 *
 * @param command The command to define.
 * @param handler The handler for the command.
 * @returns The command.
 */
export const defineCommand = <Name extends string, Ctx extends object>(
  name: Name,
  options: CommandBuilderOptions
): CommandBuilderType<Name, CommandContext<Ctx>> => {
  return createCommandBuilder(name, options);
};
