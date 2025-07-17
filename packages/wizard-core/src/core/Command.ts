import type {
  Command as CommandType,
  CommandContext,
  CommandHandlerFunction,
  CommandResolverFunction,
  HandlerContext,
  ResolverContext,
} from '../types/type-command.js';
import type { CommandBuilderOptions } from '../types/type-command-builder.js';
import type { Flags } from '../types/type-flag.js';
import type { RootType } from '../types/type-wizard.js';

export class Command<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
> implements CommandType<Name, Context, SubCommandContext, CommandFlags>
{
  private name: Name;
  private options: CommandBuilderOptions;
  private resolverFn: CommandResolverFunction<
    ResolverContext<Context>,
    SubCommandContext
  >;
  private handlerFn: CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;
  private flags: CommandFlags;
  private subCommands: CommandType<any, any, any, any>[] = [];
  private parentCommand: CommandType<any, any, any, any>;

  constructor(name: Name, options: CommandBuilderOptions) {
    this.name = name;
    this.options = options;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.options.description;
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

  setParentCommand<ParentCommandType extends CommandType<any, any, any, any>>(
    parentCommand: ParentCommandType
  ) {
    this.parentCommand = parentCommand;
  }

  getSubCommands() {
    return this.subCommands;
  }

  setSubCommands<SubCommandType extends CommandType<any, any, any, any>>(
    subCommands: SubCommandType[]
  ) {
    this.subCommands = [...this.subCommands, ...subCommands];
  }

  setResolver(
    fn: CommandResolverFunction<ResolverContext<Context>, SubCommandContext>
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
