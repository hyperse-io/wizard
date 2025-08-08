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
 * @template Name The type of the command name, usually a string literal type.
 * @template Ctx The type of the command context object, used to pass custom data to process.
 *
 * @param name The name of the command, used as the identifier in the CLI.
 * @param options The detailed configuration for the command, including description, arguments, flags, process, etc.
 * @returns Returns a command builder object for further configuration and subcommand registration.
 */
export const defineCommand = <Name extends string, Ctx extends object>(
  name: Name,
  options: CommandBuilderOptions
): CommandBuilderType<Name, CommandContext<Ctx>> => {
  return createCommandBuilder(name, options);
};
