import type {
  Command as CommandType,
  CommandContext,
  CommandName,
  CommandProcessFunction,
  CommandResolveSubContextFunction,
  ProcessContext,
  ResolveSubContextCtx,
} from '../types/type-command.js';
import type {
  CommandBuilder,
  CommandBuilderOptions,
  CommandNameToContext,
  ReturnTypeForUseFunction,
} from '../types/type-command-builder.js';
import type {
  Flags,
  FlagsWithBuiltin,
  ParseFlags,
} from '../types/type-flag.js';
import { createCommand } from './Command.js';

/**
 * @description
 * The implementation of the command builder.
 *
 * @template Name - The type of the command name.
 * @template Context - The type of the command context.
 * @template SubCommandContext - The type of the sub-command context.
 * @template NameToContext - The type of the command name to context.
 * @template CommandFlags - The type of the command flags.
 */
class CommandBuilderImpl<
  Name extends CommandName,
  Context extends CommandContext,
  SubCommandContext extends object,
  CommandFlags extends Flags,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context & {
      flags: ParseFlags<CommandFlags & FlagsWithBuiltin>;
    };
  },
> implements
    CommandBuilder<
      Name,
      Context,
      SubCommandContext,
      CommandFlags,
      NameToContext
    >
{
  private name: Name;
  private options: CommandBuilderOptions;
  private command: CommandType<Name, Context, SubCommandContext, CommandFlags>;

  constructor(
    name: Name,
    options: CommandBuilderOptions,
    command?: CommandType<Name, Context, SubCommandContext, CommandFlags>,
    subCommands?: CommandType<any, any, any, any>[]
  ) {
    this.name = name;
    this.options = options;
    this.command =
      command ||
      createCommand<Name, Context, SubCommandContext, CommandFlags>(name, {
        ...options,
      });
    for (const subCommand of subCommands || []) {
      subCommand.setParentCommand(this.command);
    }
    this.command.setSubCommands(subCommands || []);
  }

  use<SubCommandBuilders extends CommandBuilder<any, any, any, any, any>[]>(
    ...subCommands: SubCommandBuilders
  ): ReturnTypeForUseFunction<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    SubCommandBuilders,
    CommandFlags
  > {
    return new CommandBuilderImpl(
      this.name,
      this.options,
      this.command,
      subCommands.map((p) => p.getCommand())
    ) as unknown as ReturnTypeForUseFunction<
      Name,
      Context,
      SubCommandContext,
      NameToContext,
      SubCommandBuilders,
      CommandFlags
    >;
  }

  resolveSubContext(
    fn: CommandResolveSubContextFunction<
      ResolveSubContextCtx<Name, Context>,
      SubCommandContext
    >
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    CommandFlags,
    NameToContext
  > {
    this.command.setResolveSubContext(fn);
    return this;
  }

  process(
    fn: CommandProcessFunction<ProcessContext<Name, Context, CommandFlags>>
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    CommandFlags,
    NameToContext
  > {
    this.command.setProcess(fn);
    return this;
  }

  flags<SetupFlags extends Flags>(
    flags: SetupFlags
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    SetupFlags,
    NameToContext
  > {
    this.command.setFlags(flags as unknown as CommandFlags);
    return this as unknown as CommandBuilder<
      Name,
      Context,
      SubCommandContext,
      SetupFlags,
      NameToContext
    >;
  }

  getCommand(): CommandType<Name, Context, SubCommandContext, CommandFlags> {
    return this.command;
  }
}

/**
 * @description
 * Create a command builder (CommandBuilder).
 *
 * This function initializes and returns a command builder instance, which supports chainable configuration of command process, resolveSubContext, subcommands, arguments, and flags.
 *
 * @template Name - The type of the command name, usually a string or RootType.
 * @template Context - The type of the command context, defaults to CommandContext.
 * @template SubCommandContext - The type of the sub-command context, defaults to object.
 * @template NameToContext - The mapping type from command name to context, defaults to {[K in Name]: Context}.
 * @template CommandFlags - The type of the command flags, defaults to Flags.
 *
 * @param {Name} name - The name of the command.
 * @param {CommandBuilderOptions} options - The command builder options, including description, usage, and other metadata.
 *
 * @returns Returns a command builder instance for further configuration.
 */
export const createCommandBuilder = <
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context & {
      flags: ParseFlags<CommandFlags & FlagsWithBuiltin>;
    };
  },
>(
  name: Name,
  options: CommandBuilderOptions
) => {
  return new CommandBuilderImpl<
    Name,
    Context,
    SubCommandContext,
    CommandFlags,
    NameToContext
  >(name, options);
};
