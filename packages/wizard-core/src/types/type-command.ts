import type { Logger } from '@hyperse/logger';
import type { useLocale } from '../i18n/use-locale.js';
import type { CommandBuilderOptions } from './type-command-builder.js';
import type { Flags } from './type-flag.js';
import type { I18n, LocaleMessagesKeys } from './type-locale-messages.js';
import type { MaybePromise } from './type-utils.js';
import type { RootType } from './type-wizard.js';

export type CommandContext<Context extends object = object> = Context;

export interface HandlerContext<
  Name extends string | RootType,
  Context extends CommandContext,
  CommandFlags extends Flags,
> extends CommandBuilderOptions {
  ctx?: Context;
  name: Name;
  flags: CommandFlags;
  logger: Logger;
  locale: LocaleMessagesKeys;
  i18n: I18n;
}

export type CommandHandlerFunction<
  handlerContext extends HandlerContext<any, any, any>,
> = (ctx: handlerContext) => MaybePromise<void>;

export interface ResolverContext<
  Name extends string | RootType,
  Context extends CommandContext,
> extends CommandBuilderOptions {
  ctx?: Context;
  name: Name;
  logger: Logger;
  locale: LocaleMessagesKeys;
  i18n: I18n;
}

export type CommandResolverFunction<
  resolverContext extends ResolverContext<any, any>,
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

  getExtraOptions(): CommandBuilderOptions;

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
    fn: CommandResolverFunction<
      ResolverContext<Name, Context>,
      SubCommandContext
    >
  ): void;

  getResolver(): CommandResolverFunction<
    ResolverContext<Name, Context>,
    SubCommandContext
  >;

  setHandler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): void;

  getHandler(): CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;
}
