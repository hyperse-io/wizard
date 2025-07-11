import type { ARGUMENT, KNOWN_FLAG, UNKNOWN_FLAG } from '../constants.js';
import type { Dict, Equals } from './typeUtils.js';

export const DOUBLE_DASH = '--';

export type TypeFunction<ReturnType = any> = (value: any) => ReturnType;

export type TypeFunctionArray<ReturnType> = readonly [TypeFunction<ReturnType>];

export type FlagOptions = FlagSchema & {
  description: string;
};

export type Flag = FlagOptions & {
  name: string;
};

export type Flags = Dict<FlagOptions>;

export type FlagType<ReturnType = any> =
  | TypeFunction<ReturnType>
  | TypeFunctionArray<ReturnType>;

export type FlagSchemaBase<TF> = {
  /**
   * Type of the flag as a function that parses the argv string and returns the
   * parsed value.
   *
   * @example
   *
   * ```
   * type: String;
   * ```
   *
   * @example Wrap in an array to accept multiple values. `type: [Boolean]`
   *
   * @example Custom function type that uses moment.js to parse string as date.
   * `type: function CustomDate(value: string) { return moment(value).toDate();
   * }`
   */
  type: TF;
  /**
   * A single-character alias for the flag.
   *
   * @example
   *
   * ```
   * alias: "s";
   * ```
   */
  alias?: string;
} & Record<PropertyKey, unknown>;

export type FlagSchemaDefault<TF, DefaultType = any> = FlagSchemaBase<TF> & {
  /**
   * Default value of the flag. Also accepts a function that returns the default
   * value. [Default: undefined]
   *
   * @example
   *
   * ```
   * default: 'hello'
   * ```
   *
   * @example
   *
   * ```
   * default: () => [1, 2, 3]
   * ```
   */
  default: DefaultType | (() => DefaultType);
};

export type FlagSchema<TF = FlagType> =
  | FlagSchemaBase<TF>
  | FlagSchemaDefault<TF>;

export type FlagTypeOrSchema<ExtraOptions = Record<string, unknown>> =
  | FlagType
  | (FlagSchema & ExtraOptions);

export type SchemaFlags<ExtraOptions = Record<string, unknown>> = Record<
  string,
  FlagTypeOrSchema<ExtraOptions>
>;

export type InferFlagType<Flag extends FlagTypeOrSchema> = Flag extends
  | TypeFunctionArray<infer T>
  | FlagSchema<TypeFunctionArray<infer T>>
  ? Flag extends FlagSchemaDefault<TypeFunctionArray<T>, infer D>
    ? T[] | D
    : T[]
  : Flag extends TypeFunction<infer T> | FlagSchema<TypeFunction<infer T>>
    ? Flag extends FlagSchemaDefault<TypeFunction<T>, infer D>
      ? T | D
      : T | undefined
    : never;

export interface ParsedFlags<Schemas = Record<string, unknown>> {
  flags: Schemas;
  unknownFlags: Record<string, (string | boolean)[]>;
  _: string[] & {
    [DOUBLE_DASH]: string[];
  };
}

export type TypeFlag<Schemas extends SchemaFlags> = ParsedFlags<{
  [flag in keyof Schemas]: InferFlagType<Schemas[flag]>;
}>;

export interface IgnoreFunction {
  (type: typeof ARGUMENT, argvElement: string): boolean | void;
  (
    type: typeof KNOWN_FLAG | typeof UNKNOWN_FLAG,
    flagName: string,
    flagValue: string | undefined
  ): boolean | void;
}

export interface TypeFlagOptions {
  /**
   * Which argv elements to ignore from parsing
   */
  ignore?: IgnoreFunction;
}

export type FallbackFlags<F extends Flags | undefined> =
  Equals<NonNullableFlag<F>['flags'], {}> extends true
    ? Dict<any>
    : NonNullableFlag<F>['flags'];

export type NonNullableFlag<F extends Flags | undefined> = TypeFlag<
  NonNullable<F>
>;
