import type {
  Command as CommandType,
  CommandContext,
  CommandHandlerFunction,
  CommandResolverFunction,
  HandlerContext,
  ResolverContext,
} from '../types/type-command.js';
import type {
  CommandBuilder,
  CommandBuilderOptions,
  CommandNameToContext,
  ReturnTypeForUseFunction,
} from '../types/type-command-builder.js';
import type { Flags } from '../types/type-flag.js';
import type { RootType } from '../types/type-wizard.js';
import { createCommand } from './Command.js';

class CommandBuilderImpl<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context;
  },
  CommandFlags extends Flags = Flags,
> implements
    CommandBuilder<
      Name,
      Context,
      SubCommandContext,
      NameToContext,
      CommandFlags
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
      createCommand<Name, Context, SubCommandContext, CommandFlags>(
        name,
        options
      );
    for (const subCommand of subCommands || []) {
      subCommand.setParentCommand(this.command);
    }
    this.command.setSubCommands(subCommands || []);
  }

  use<SubCommandBuilders extends CommandBuilder<any, any, any, any>[]>(
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

  resolver(
    fn: CommandResolverFunction<
      ResolverContext<Name, Context>,
      SubCommandContext
    >
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    CommandFlags
  > {
    this.command.setResolver(fn);
    return this;
  }

  handler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    CommandFlags
  > {
    this.command.setHandler(fn);
    return this;
  }

  flags<SetupFlags extends Flags>(
    flags: SetupFlags
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    SetupFlags
  > {
    this.command.setFlags(flags as unknown as CommandFlags);
    return this as unknown as CommandBuilder<
      Name,
      Context,
      SubCommandContext,
      NameToContext,
      SetupFlags
    >;
  }

  getCommand(): CommandType<Name, Context, SubCommandContext, CommandFlags> {
    return this.command;
  }
}

export const createCommandBuilder = <
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context;
  },
  CommandFlags extends Flags = Flags,
>(
  name: Name,
  options: CommandBuilderOptions
) =>
  new CommandBuilderImpl<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    CommandFlags
  >(name, options);
