export type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export type Dict<T> = Record<string, T>;

export type ToArray<T> = T extends any[] ? T : [T];

export type MaybeArray<T> = T | T[];

export type MaybePromise<T> = T | Promise<T>;

export type MergeCommandMapping<A, B> = {
  [Key in keyof A | keyof B]: Key extends keyof A
    ? A[Key]
    : Key extends keyof B
      ? B[Key]
      : never;
};
