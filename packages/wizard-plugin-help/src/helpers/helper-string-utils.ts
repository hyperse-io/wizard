import type { KebabCase } from '../types/type-string.js';

export const kebabCase = <T extends string>(s: T) =>
  s.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`) as KebabCase<T>;

export const gracefulFlagName = (n: string) =>
  n.length <= 1 ? `-${n}` : `--${kebabCase(n)}`;
