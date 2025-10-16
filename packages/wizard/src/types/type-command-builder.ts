import type {
  Command,
  CommandContext,
  CommandName,
  CommandOptions,
  CommandProcessFunction,
  CommandResolveSubContextFunction,
  ProcessContext,
  ResolveSubContextCtx,
} from './type-command.js';
import type { Flags, ParseFlags } from './type-flag.js';
import type { FlagsWithBuiltin } from './type-flag.js';

/**
 * @description
 * Options for building a command, including description, example, and help message resolvers.
 */
export type CommandBuilderOptions = CommandOptions;

/**
 * @description
 * Extracts the NameToContext mapping from a CommandBuilder type.
 * @template Builder - The CommandBuilder type to extract from.
 * @returns {NameToContext} The mapping from command names to their contexts.
 */
export type GetCommandNameToContext<Builder> =
  Builder extends CommandBuilder<any, any, any, any, infer NameToContext>
    ? NameToContext
    : never;

/**
 * @description
 * Represents a mapping from command names to their respective CommandContext types.
 * @example
 * { "foo": CommandContext, "bar": CommandContext }
 */
export type CommandNameToContext = object;

/**
 * @description
 * Merge two CommandNameToContext maps.
 * @template Original - The first CommandNameToContext map.
 * @template Target - The second CommandNameToContext map.
 * @returns {CommandNameToContext} The merged CommandNameToContext map.
 */
type LiteralKey<K> = string extends K
  ? never
  : number extends K
    ? never
    : symbol extends K
      ? never
      : K;

type PickLiteralKeys<T> = {
  [K in keyof T as LiteralKey<K>]: T[K];
};

export type MergeCommandNameToContext<Original, Target> =
  PickLiteralKeys<Original> & PickLiteralKeys<Target>;

/**
 * @description
 * Infers the self context type from a CommandBuilder instance.
 * @template T - The CommandBuilder type.
 * @returns {S} The self context type.
 */
export type GetSelfContext<T> =
  T extends CommandBuilder<any, infer S, any, any, any> ? S : never;

/**
 * @description
 * Recursively merges the self context types from an array of CommandBuilder types.
 * @template T - Array of CommandBuilder types.
 * @returns {object} The merged context type.
 */
export type MergeSelfContexts<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? GetSelfContext<First> & MergeSelfContexts<Rest>
  : {};

/**
 * @description
 * Prefixes all keys in a CommandNameToContext map with a given prefix (usually the parent command name).
 * @template T - The CommandNameToContext map.
 * @template Prefix - The prefix string or RootType.
 * @returns {object} The prefixed command map.
 * @example
 * PrefixPluginMap<{foo: Ctx}, 'bar'> // { 'bar.foo': Ctx }
 */
export type PrefixPluginMap<
  T extends CommandNameToContext,
  Prefix extends CommandName,
> = {
  [K in keyof T as K extends string ? `${Prefix & string}.${K}` : never]: T[K];
};

/**
 * @description
 * Recursively merges an array of CommandNameToContext maps into a single map.
 * @template T - Array of CommandNameToContext maps.
 * @returns {object} The merged command map.
 */
export type MergeCommandMap<T extends CommandNameToContext[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & (Rest extends CommandNameToContext[] ? MergeCommandMap<Rest> : {})
  : {};

/**
 * @description
 * Computes the return type for the `use` function of CommandBuilder, combining sub-command contexts and command maps.
 * @template Name - The name of the current command.
 * @template Context - The context type of the current command.
 * @template SubCommandContext - The context type for sub-commands.
 * @template NameToContext - The mapping from command names to contexts for the current builder.
 * @template Plugins - The array of sub-command CommandBuilder types.
 * @template CommandFlags - The flags type for the command.
 * @returns {CommandBuilder} A new CommandBuilder type with merged contexts and command maps.
 */
export type ReturnTypeForUseFunction<
  Name extends CommandName,
  Context extends CommandContext,
  SubCommandContext extends object,
  NameToContext extends CommandNameToContext,
  Plugins extends CommandBuilder<any, any, any, any, any>[],
  CommandFlags extends Flags,
> = CommandBuilder<
  Name,
  Context,
  SubCommandContext & MergeSelfContexts<Plugins>,
  CommandFlags,
  NameToContext &
    MergeCommandMap<{
      [K in keyof Plugins]: Plugins[K] extends CommandBuilder<
        any,
        any,
        any,
        any,
        infer InnerNameToContext
      >
        ? PrefixPluginMap<InnerNameToContext, Name>
        : {};
    }>
>;

/**
 * @description
 * Helper type to compute the current command's entry in NameToContext map
 * with the accurate parsed flags (including built-in flags).
 */
// Intentionally unused helper kept for future composition; prefix with _ to appease linter.
type _SelfNameToContextEntry<
  Name extends CommandName,
  Context extends CommandContext,
  CommandFlags extends Flags,
> = {
  [K in Name]: Context & {
    flags: ParseFlags<CommandFlags & FlagsWithBuiltin>;
  };
};

/**
 * @description
 * Replace current command's mapping in NameToContext with recomputed flags type
 * while preserving other entries.
 */
export type RecomputeSelfInMap<
  NameToContext extends CommandNameToContext,
  Name extends CommandName,
  Context extends CommandContext,
  CommandFlags extends Flags,
> = {
  [K in keyof NameToContext as K extends Name ? never : K]: NameToContext[K];
} & {
  [K in Name]: Context & {
    flags: ParseFlags<CommandFlags & FlagsWithBuiltin>;
  };
};

/**
 * @description
 * The main interface for building commands. Provides a fluent API for defining sub-commands, flags, resolvers, handlers, and extracting the final command.
 *
 * @template Name - The name of the command (string or RootType).
 * @template Context - The context type for the command.
 * @template SubCommandContext - The context type for sub-commands.
 * @template NameToContext - The mapping from command names to contexts.
 * @template CommandFlags - The type of flags supported by the command.
 */
export interface CommandBuilder<
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context & {
      flags: ParseFlags<CommandFlags & FlagsWithBuiltin>;
    };
  },
> {
  /**
   * @description
   * Registers sub-commands for the current command. Returns a new CommandBuilder with merged sub-command contexts and command maps.
   *
   * @remarks `Function`
   * @param {...SubCommandBuilders} subCommands - The sub-command builders to register.
   * @returns {CommandBuilder} A new CommandBuilder with updated context and command map.
   */
  use<SubCommandBuilders extends CommandBuilder<any, any, any, any, any>[]>(
    ...subCommands: SubCommandBuilders
  ): ReturnTypeForUseFunction<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    SubCommandBuilders,
    CommandFlags
  >;

  /**
   * @description
   * Defines the flags for the command. Returns a new CommandBuilder with the updated flags type.
   *
   * @remarks `Function`
   * @param {T} flags - The flags definition object.
   * @returns {CommandBuilder} A new CommandBuilder with the specified flags type.
   */
  flags<T extends Flags>(
    flags: T
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    T,
    RecomputeSelfInMap<NameToContext, Name, Context, T>
  >;

  /**
   * @description
   * Defines a resolver function for the command. The resolveSubContext is used to resolve context before the handler is executed.
   *
   * @remarks `Function`
   * @param {CommandResolveSubContextFunction} fn - The resolveSubContext function.
   * @returns {CommandBuilder} A new CommandBuilder with the resolveSubContext attached.
   */
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
  >;

  /**
   * @description
   * Defines a process function for the command. The process is executed when the command is invoked.
   *
   * @remarks `Function`
   * @param {CommandProcessFunction} fn - The process function.
   * @returns {CommandBuilder} A new CommandBuilder with the process attached.
   */
  process(
    fn: CommandProcessFunction<ProcessContext<Name, Context, CommandFlags>>
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    CommandFlags,
    NameToContext
  >;

  /**
   * @description
   * Extracts the final Command object from the builder, which can be registered or executed.
   *
   * @remarks `Function`
   * @returns {Command} The built Command instance.
   */
  getCommand(): Command<Name, Context, SubCommandContext, CommandFlags>;
}
