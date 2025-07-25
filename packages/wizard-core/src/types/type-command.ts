import type { Logger } from '@hyperse/logger';
import type { Flags, FlagsWithI18n } from './type-flag.js';
import type {
  I18n,
  LocaleMessageResolver,
  SupportedLocales,
} from './type-locale-messages.js';
import type { RootType } from './type-wizard.js';

export type CommandName = string | RootType;

export type CommandWithI18n<Name extends CommandName> = {
  name: Name;
  description: string;
  example?: string;
  help?: string;
  flags: FlagsWithI18n;
  rawCommand: Command<Name>;
};

/**
 * @description
 * Options for building a command, including description, example, and help message resolvers.
 */
export type CommandOptions = {
  /**
   * The description of the command, supports i18n.
   */
  description: LocaleMessageResolver;
  /**
   * The example of the command, supports i18n.
   */
  example?: LocaleMessageResolver;
  /**
   * The help message for the command, supports i18n.
   */
  help?: LocaleMessageResolver;
};

export type CommandBasicInfoWithI18n = {
  /**
   * The description of the command, supports i18n.
   */
  description: string;
  /**
   * The example of the command, supports i18n.
   */
  example?: string;
  /**
   * The help message for the command, supports i18n.
   */
  help?: string;
};

/**
 * @description
 * CommandContext is a generic type representing the context object passed to command handlers and resolvers.
 * @template Context - The type of the context object passed to the command.
 */
export type CommandContext<Context extends object = object> = Context;

/**
 * @description
 * HandlerContext provides the full context for a command handler function, including command name, flags, logger, locale, i18n, and any custom context.
 * @template Name - The type of the command name (string or RootType)
 * @template Context - The type of the context object passed to the handler.
 * @template CommandFlags - The type of the flags object for the command.
 */
export interface HandlerContext<
  Name extends string | RootType,
  Context extends CommandContext,
  CommandFlags extends Flags,
> extends CommandBasicInfoWithI18n {
  /**
   * Custom context object passed to the handler, typically set by a resolver or parent command.
   */
  ctx?: Context;
  /**
   * The name of the command being executed.
   */
  name: Name;
  /**
   * The parsed flags for the command.
   */
  flags: CommandFlags;
  /**
   * Logger instance for outputting logs within the handler.
   */
  logger: Logger;
  /**
   * The current locale key for i18n messages.
   */
  locale: SupportedLocales;
  /**
   * I18n instance for retrieving localized messages.
   */
  i18n: I18n;
}

/**
 * @description
 * CommandHandlerFunction is the function signature for a command handler, receiving a HandlerContext and returning void or a Promise.
 * @template handlerContext - The type of the context object passed to the handler.
 */
export type CommandHandlerFunction<
  handlerContext extends HandlerContext<any, any, any>,
> = (ctx: handlerContext) => void;

/**
 * @description
 * ResolverContext provides the context for a command resolver function, similar to HandlerContext but without flags.
 * @template Name - The type of the command name (string or RootType)
 * @template Context - The type of the context object passed to handlers/resolvers
 */
export interface ResolverContext<
  Name extends string | RootType,
  Context extends CommandContext,
> extends CommandBasicInfoWithI18n {
  /**
   * The name of the command being resolved.
   */
  name: Name;
  /**
   * Custom context object passed to the resolver, typically set by a parent command.
   */
  ctx?: Context;
  /**
   * Logger instance for outputting logs within the resolver.
   */
  logger: Logger;
  /**
   * The current locale key for i18n messages.
   */
  locale: SupportedLocales;
  /**
   * I18n instance for retrieving localized messages.
   */
  i18n: I18n;
}

/**
 * @description
 * CommandResolverFunction is the function signature for a command resolver, which can return a sub-command context directly or via a function.
 * @template resolverContext - The type of the context object passed to the resolver.
 * @template SubCommandContext - The type of the context object for sub-commands.
 */
export type CommandResolverFunction<
  resolverContext extends ResolverContext<any, any>,
  SubCommandContext extends object,
> =
  | SubCommandContext
  | ((ctx: resolverContext) => SubCommandContext | Promise<SubCommandContext>);

/**
 * Command interface defines the contract for a command object in the CLI framework.
 * It supports hierarchical commands, sub-commands, flags, resolvers, and handlers.
 *
 * @template Name - The type of the command name (string or RootType)
 * @template Context - The type of the context object passed to handlers/resolvers
 * @template SubCommandContext - The type of the context object for sub-commands
 * @template CommandFlags - The type of the flags object for the command
 */
export interface Command<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
> {
  /**
   * Returns the name of the command.
   */
  get name(): Name;

  /**
   * Returns the description of the command.
   */
  get description(): LocaleMessageResolver;

  /**
   * Returns the example of the command.
   */
  get example(): LocaleMessageResolver | undefined;

  /**
   * Returns the help message of the command.
   */
  get help(): LocaleMessageResolver | undefined;

  /**
   * Returns the parsed flags for the command.
   */
  get flags(): CommandFlags;

  /**
   * Returns the parent command, if any.
   */
  get parentCommand(): Command<Name, any, any, any>;

  /**
   * Returns the list of sub-commands for this command.
   */
  get subCommands(): Command<Name, any, any, any>[];

  /**
   * Returns the handler function for this command.
   */
  get handler(): CommandHandlerFunction<
    HandlerContext<Name, Context, CommandFlags>
  >;

  /**
   * Returns the resolver function for this command.
   */
  get resolver(): CommandResolverFunction<
    ResolverContext<Name, Context>,
    SubCommandContext
  >;

  /**
   * Sets the parsed flags for the command.
   * @param flags - The flags object to set for this command.
   */
  setFlags(flags: CommandFlags): void;

  /**
   * Sets the parent command for this command.
   * @param parentCommand - The parent command instance.
   */
  setParentCommand<ParentCommandType extends Command<any, any, any, any>>(
    parentCommand: ParentCommandType
  ): void;

  /**
   * Sets the list of sub-commands for this command.
   * @param subCommands - An array of sub-command instances.
   */
  setSubCommands<SubCommandType extends Command<any, any, any, any>>(
    subCommands: SubCommandType[]
  ): void;

  /**
   * Sets the resolver function for this command, which can provide context for sub-commands.
   * @param fn - The resolver function.
   */
  setResolver(
    fn: CommandResolverFunction<
      ResolverContext<Name, Context>,
      SubCommandContext
    >
  ): void;

  /**
   * Sets the handler function for this command, which is executed when the command is invoked.
   * @param fn - The handler function.
   */
  setHandler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): void;
}
