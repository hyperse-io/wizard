export const toPascalCase = <T extends string>(
  str?: T
): Capitalize<Lowercase<T>> => {
  const s = str?.trim();
  return (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s) as Capitalize<
    Lowercase<T>
  >;
};
