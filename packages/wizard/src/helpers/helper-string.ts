export const toPascalCase = <T extends string>(str: T) => {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as T;
};
