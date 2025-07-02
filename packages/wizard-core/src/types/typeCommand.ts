import type { LiteralUnion, OmitIndexSignature, Simplify } from 'type-fest';
import type { Root } from '../constants.js';
import type { Wizard } from '../core/Wizard.js';
import type { CamelCase } from './typeCase.js';
import type {
  FallbackFlags,
  Flags,
  FlagSchema,
  NonNullableFlag,
  ParsedFlags,
} from './typeFlag.js';
import type { InterceptorContext } from './typeInterceptor.js';
import type {
  Dict,
  Equals,
  MaybeArray,
  NonNullableParameters,
  ParameterType,
  StripBrackets,
} from './typeUtils.js';
import type { RootType } from './typeWizard.js';

export type GlobalFlagOption = FlagSchema;
export type GlobalFlagOptions = Dict<GlobalFlagOption>;

export type CommandType = RootType | string;

export declare interface CommandCustomProperties {}

export interface CommandOptions<
  P extends string[] = string[],
  A extends MaybeArray<string | RootType> = MaybeArray<string | RootType>,
  F extends Flags = Flags,
> extends CommandCustomProperties {
  alias?: A;
  parameters?: P;
  flags?: F;
}
export type Command<
  N extends string | RootType = string,
  O extends CommandOptions = CommandOptions,
> = O & {
  name: N;
  description: string;
};

export type CommandAlias<
  N extends string | RootType = string,
  O extends CommandOptions = CommandOptions,
> = Command<N, O> & {
  __isAlias?: true;
};

export type CommandWithHandler<
  N extends string | RootType = string,
  O extends CommandOptions = CommandOptions,
> = Command<N, O> & {
  handler?: HandlerInCommand<
    HandlerContext<Record<N, Command<N, O>> & Record<never, never>, N>
  >;
};
export type Commands = Dict<Command> & { [Root]?: Command };

export interface HandlerContext<
  C extends Commands = Commands,
  N extends keyof C = keyof C,
  GF extends GlobalFlagOptions = {},
> {
  name?: LiteralUnion<N, string>;
  called?: string | RootType;
  resolved: boolean;
  hasRootOrAlias: boolean;
  hasRoot: boolean;
  raw: Simplify<ParseRaw<C[N], GF>>;
  parameters: Simplify<ParseParameters<C, N>>;
  unknownFlags: ParsedFlags['unknownFlags'];
  flags: Simplify<ParseFlag<C, N, GF> & Record<string, any>>;
  cli: Wizard<C, GF>;
}

export type Handler<
  C extends Commands = Commands,
  K extends keyof C = keyof C,
  GF extends GlobalFlagOptions = {},
> = (ctx: HandlerContext<C, K, GF>) => void;

export type HandlerInCommand<C extends HandlerContext> = (ctx: {
  [K in keyof C]: C[K];
}) => void;

export type CommandEventMap<T extends Commands> = {
  [K in keyof T]: [InterceptorContext];
};

export type TransformParameters<C extends Command> = {
  [Parameter in NonNullableParameters<C['parameters']>[number] as CamelCase<
    StripBrackets<Parameter>
  >]: ParameterType<Parameter>;
};

export type ParseFlag<
  C extends Commands,
  N extends keyof C,
  GF extends GlobalFlagOptions = {},
> = N extends keyof C
  ? OmitIndexSignature<NonNullableFlag<C[N]['flags'] & GF>['flags']>
  : FallbackFlags<C[N]['flags'] & GF>['flags'];

export type ParseRaw<
  C extends Command,
  GF extends GlobalFlagOptions = {},
> = NonNullableFlag<C['flags'] & GF> & {
  flags: FallbackFlags<C['flags'] & GF>;
  parameters: string[];
  mergedFlags: FallbackFlags<C['flags'] & GF> &
    NonNullableFlag<C['flags'] & GF>['unknownFlags'];
};

export type ParseParameters<
  C extends Commands = Commands,
  N extends keyof C = keyof C,
> =
  Equals<TransformParameters<C[N]>, {}> extends true
    ? N extends keyof C
      ? TransformParameters<C[N]>
      : Dict<string | string[] | undefined>
    : TransformParameters<C[N]>;
