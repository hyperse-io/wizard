import type { Logger } from '@hyperse/logger';
import type { Flags } from './type-flag.js';
import type { MaybePromise } from './type-utils.js';
import type { RootType } from './type-wizard.js';

export type CommandContext<Context extends object = object> = Context;

export interface HandlerContext<
  Name extends string | RootType,
  Context extends CommandContext,
  CommandFlags extends Flags,
> {
  ctx?: Context;
  name: Name;
  description: string;
  flags: CommandFlags;
  logger: Logger;
  locale: string;
}

export type CommandHandlerFunction<
  handlerContext extends HandlerContext<any, any, any>,
> = (ctx: handlerContext) => MaybePromise<void>;

export interface ResolverContext<Context extends CommandContext> {
  ctx?: Context;
  logger: Logger;
  locale: string;
}

export type CommandResolverFunction<
  resolverContext extends ResolverContext<any>,
  SubCommandContext extends object,
> =
  | SubCommandContext
  | ((ctx: resolverContext) => MaybePromise<SubCommandContext>);

export interface Command<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
> {
  getName(): Name;

  getDescription(): string;

  setFlags(flags: CommandFlags): void;

  getFlags(): CommandFlags;

  getParentCommand(): Command<any, any, any, any>;

  setParentCommand<ParentCommandType extends Command<any, any, any, any>>(
    parentCommand: ParentCommandType
  ): void;

  getSubCommands(): Command<any, any, any, any>[];

  setSubCommands<SubCommandType extends Command<any, any, any, any>>(
    subCommands: SubCommandType[]
  ): void;

  setResolver(
    fn: CommandResolverFunction<ResolverContext<Context>, SubCommandContext>
  ): void;

  getResolver(): CommandResolverFunction<
    ResolverContext<Context>,
    SubCommandContext
  >;

  setHandler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): void;

  getHandler(): CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;
}
