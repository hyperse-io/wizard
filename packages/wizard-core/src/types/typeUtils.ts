export type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
export type Dict<T> = Record<string, T>;
export type ToArray<T> = T extends any[] ? T : [T];
export type MaybeArray<T> = T | T[];

export type StripBrackets<Parameter extends string> = Parameter extends
  | `<${infer ParameterName}>`
  | `[${infer ParameterName}]`
  ? ParameterName extends `${infer SpreadName}...`
    ? SpreadName
    : ParameterName
  : never;

export type ParameterType<Parameter extends string> = Parameter extends
  | `<${infer _ParameterName}...>`
  | `[${infer _ParameterName}...]`
  ? string[]
  : Parameter extends `<${infer _ParameterName}>`
    ? string
    : Parameter extends `[${infer _ParameterName}]`
      ? string | undefined
      : never;

export type NonNullableParameters<T extends string[] | undefined> =
  T extends undefined ? [] : NonNullable<T>;
