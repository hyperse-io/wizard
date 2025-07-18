import type {
  Command,
  CommandContext,
  CommandHandlerFunction,
  CommandResolverFunction,
  HandlerContext,
  ResolverContext,
} from './type-command.js';
import type { Flags } from './type-flag.js';
import type { RootType } from './type-wizard.js';

export type CommandBuilderOptions = {
  description: string;
  example?: string;
  help?: string;
};

export type GetCommandNameToContext<Builder> =
  Builder extends CommandBuilder<any, any, any, infer NameToContext, any>
    ? NameToContext
    : never;

export type CommandNameToContext = Record<string, CommandContext>;

export type GetSelfContext<T> =
  T extends CommandBuilder<any, infer S, any, any, any> ? S : never;

export type MergeSelfContexts<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? GetSelfContext<First> & MergeSelfContexts<Rest>
  : {};

export type PrefixPluginMap<
  T extends CommandNameToContext,
  Prefix extends string | RootType,
> = {
  [K in keyof T as K extends string ? `${Prefix & string}.${K}` : never]: T[K];
};

export type MergeCommandMap<T extends CommandNameToContext[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & (Rest extends CommandNameToContext[] ? MergeCommandMap<Rest> : {})
  : {};

export type ReturnTypeForUseFunction<
  Name extends string | RootType,
  Context extends CommandContext,
  SubCommandContext extends object,
  NameToContext extends CommandNameToContext,
  Plugins extends CommandBuilder<any, any, any, any, any>[],
  CommandFlags extends Flags,
> = CommandBuilder<
  Name,
  Context,
  SubCommandContext & MergeSelfContexts<Plugins>,
  NameToContext &
    MergeCommandMap<{
      [K in keyof Plugins]: Plugins[K] extends CommandBuilder<
        any,
        any,
        any,
        infer InnerNameToContext,
        any
      >
        ? PrefixPluginMap<InnerNameToContext, Name>
        : {};
    }>,
  CommandFlags
>;

export interface CommandBuilder<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  NameToContext extends CommandNameToContext = {
    [K in Name]: Context;
  },
  CommandFlags extends Flags = Flags,
> {
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

  flags<T extends Flags>(
    flags: T
  ): CommandBuilder<Name, Context, SubCommandContext, NameToContext, T>;

  resolver(
    fn: CommandResolverFunction<ResolverContext<Context>, SubCommandContext>
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    CommandFlags
  >;

  handler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    NameToContext,
    CommandFlags
  >;

  getCommand(): Command<Name, Context, SubCommandContext, CommandFlags>;
}
