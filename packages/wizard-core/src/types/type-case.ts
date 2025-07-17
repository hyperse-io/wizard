type AlphabetLowercase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type Numeric = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type AlphaNumeric = AlphabetLowercase | Uppercase<AlphabetLowercase> | Numeric;

export type CamelCase<Word extends string> =
  Word extends `${infer FirstCharacter}${infer Rest}`
    ? FirstCharacter extends AlphaNumeric
      ? `${FirstCharacter}${CamelCase<Rest>}`
      : Capitalize<CamelCase<Rest>>
    : Word;

export type KebabCase<
  T extends string,
  A extends string = '',
> = T extends `${infer Prefix}${infer Suffix}`
  ? KebabCase<
      Suffix,
      `${A}${Prefix extends Lowercase<Prefix> ? '' : '-'}${Lowercase<Prefix>}`
    >
  : A;
