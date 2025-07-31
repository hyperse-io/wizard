export type KebabCase<
  T extends string,
  A extends string = '',
> = T extends `${infer Prefix}${infer Suffix}`
  ? KebabCase<
      Suffix,
      `${A}${Prefix extends Lowercase<Prefix> ? '' : '-'}${Lowercase<Prefix>}`
    >
  : A;
