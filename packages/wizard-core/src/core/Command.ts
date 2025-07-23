import type {
  Command,
  CommandContext,
  CommandHandlerFunction,
  CommandName,
  CommandOptions,
  CommandResolverFunction,
  HandlerContext,
  ResolverContext,
} from '../types/type-command.js';
import type { Flags } from '../types/type-flag.js';

/**
 * @description
 * The implementation of the command.
 *
 * @template Name - The type of the command name.
 * @template Context - The type of the command context.
 * @template SubCommandContext - The type of the sub-command context.
 * @template CommandFlags - The type of the command flags.
 */
class CommandImpl<
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
> implements Command<Name, Context, SubCommandContext, CommandFlags>
{
  private cmdName: Name;
  private cmdFlags: CommandFlags;
  private cmdSubCommands: Command<any, any, any, any>[] = [];
  private cmdParentCommand: Command<any, any, any, any>;
  private cmdOptions: CommandOptions;
  private cmdResolverFn: CommandResolverFunction<
    ResolverContext<Name, Context>,
    SubCommandContext
  >;
  private cmdHandlerFn: CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;

  constructor(name: Name, options: CommandOptions) {
    this.cmdName = name;
    this.cmdOptions = options;
  }

  get name(): Name {
    return this.cmdName;
  }

  get description() {
    return this.cmdOptions.description;
  }

  get example() {
    return this.cmdOptions.example;
  }

  get help() {
    return this.cmdOptions.help;
  }

  get flags() {
    return this.cmdFlags;
  }

  get parentCommand() {
    return this.cmdParentCommand;
  }

  get subCommands() {
    return this.cmdSubCommands;
  }

  get resolver() {
    return this.cmdResolverFn;
  }

  get handler() {
    return this.cmdHandlerFn;
  }

  setFlags(flags: CommandFlags): void {
    this.cmdFlags = flags;
  }

  setParentCommand<ParentCommandType extends Command<any, any, any, any>>(
    parentCommand: ParentCommandType
  ) {
    this.cmdParentCommand = parentCommand;
  }

  setSubCommands<SubCommandType extends Command<any, any, any, any>>(
    subCommands: SubCommandType[]
  ) {
    this.cmdSubCommands = [...this.cmdSubCommands, ...subCommands];
  }

  setResolver(
    fn: CommandResolverFunction<
      ResolverContext<Name, Context>,
      SubCommandContext
    >
  ) {
    this.cmdResolverFn = fn;
  }

  setHandler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): void {
    this.cmdHandlerFn = fn;
  }
}

/**
 * @description
 * Create a command instance.
 *
 * This function initializes and returns a command instance (CommandImpl), which can be further configured with handlers, resolvers, subcommands, arguments, and flags.
 *
 * @template Name - The type of the command name, usually a string or RootType.
 * @template Context - The type of the command context, defaults to CommandContext.
 * @template SubCommandContext - The type of the sub-command context, defaults to object.
 * @template CommandFlags - The type of the command flags, defaults to Flags.
 *
 * @param {CommandBuilderOptions} options - The command options, including description, usage, and other metadata.
 *
 * @returns Returns a command instance for further configuration.
 */
export const createCommand = <
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
>(
  name: Name,
  options: CommandOptions
) =>
  new CommandImpl<Name, Context, SubCommandContext, CommandFlags>(
    name,
    options
  );
