export type TypeFunction<ReturnType = any> = (value: any) => ReturnType;

export type TypeFunctionArray<ReturnType> = readonly [TypeFunction<ReturnType>];

export type Flag = FlagOptions & {
  name: string;
};

export type FlagOptions = FlagSchema & {
  description: string;
};

export type Flags = Record<string, FlagOptions>;

/**
 * @description
 * Infer the flag type or schema.
 *
 * @template ReturnType - The return type.
 * @returns {T} The flag type or schema.
 */
export type FlagType<ReturnType = any> =
  | TypeFunction<ReturnType>
  | TypeFunctionArray<ReturnType>;

/**
 * @description
 * Infer the flag type or schema.
 *
 * @template TF - The flag type.
 * @returns {T} The flag type or schema.
 */
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

/**
 * @description
 * Extra schema for the flag.
 */
export type FlagExtraSchema = {
  /**
   * Whether the flag is required.
   *
   * @example
   *
   * ```
   * required: true;
   * ```
   * @default false
   */
  required?: boolean;
};

/**
 * @description
 * Infer the flag type or schema.
 *
 * @template TF - The flag type.
 * @template DefaultType - The default type.
 * @returns {T} The flag type or schema.
 */
export type FlagSchemaDefault<TF, DefaultType = any> = FlagSchemaBase<TF> &
  FlagExtraSchema & {
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

/**
 * @description
 * Infer the flag type or schema.
 *
 * @template TF - The flag type.
 * @returns {T} The flag type or schema.
 */
export type FlagSchema<TF = FlagType> =
  | FlagSchemaBase<TF>
  | FlagSchemaDefault<TF>;

/**
 * @description
 * Infer the flag type.
 *
 * @template Flag - The flag type or schema.
 * @returns {T} The flag type.
 */
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

/**
 * @description
 * Infer the flag type or schema.
 *
 * @template ExtraOptions - The extra options.
 * @returns {T} The flag type or schema.
 */
export type FlagTypeOrSchema<ExtraOptions = Record<string, unknown>> =
  | FlagType
  | (FlagSchema & ExtraOptions);
