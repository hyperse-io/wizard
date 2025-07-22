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
import type { I18n } from '../types/type-locale-messages.js';

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
  private commandName: Name;
  private options: CommandOptions;
  private resolverFn: CommandResolverFunction<
    ResolverContext<Name, Context>,
    SubCommandContext
  >;
  private handlerFn: CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;
  private flags: CommandFlags;
  private subCommands: Command<any, any, any, any>[] = [];
  private parentCommand: Command<any, any, any, any>;
  private I18n: I18n;

  constructor(name: Name, options: CommandOptions) {
    this.commandName = name;
    this.options = options;
  }

  get name(): Name {
    return this.commandName;
  }

  get description() {
    return this.options.description;
  }

  get example() {
    return this.options.example;
  }

  get help() {
    return this.options.help;
  }

  setFlags(flags: CommandFlags): void {
    this.flags = flags;
  }

  getFlags() {
    return this.flags;
  }

  getParentCommand() {
    return this.parentCommand;
  }

  setParentCommand<ParentCommandType extends Command<any, any, any, any>>(
    parentCommand: ParentCommandType
  ) {
    this.parentCommand = parentCommand;
  }

  getSubCommands() {
    return this.subCommands;
  }

  setSubCommands<SubCommandType extends Command<any, any, any, any>>(
    subCommands: SubCommandType[]
  ) {
    this.subCommands = [...this.subCommands, ...subCommands];
  }

  setResolver(
    fn: CommandResolverFunction<
      ResolverContext<Name, Context>,
      SubCommandContext
    >
  ) {
    this.resolverFn = fn;
  }

  getResolver() {
    return this.resolverFn;
  }

  setHandler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): void {
    this.handlerFn = fn;
  }

  getHandler() {
    return this.handlerFn;
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
