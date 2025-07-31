import type { KebabCase } from '../types/type-string.js';

/**
 * @description
 * Convert a string to kebab case.
 *
 * @param s - The string to convert.
 * @returns The kebab case string.
 */
export const kebabCase = <T extends string>(s: T) =>
  s.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`) as KebabCase<T>;

/**
 * @description
 * Format the flag name for display in help messages.
 *
 * @param n - The flag name.
 * @returns The formatted flag name.
 */
export const gracefulFlagName = (n: string) =>
  n.length <= 1 ? `-${n}` : `--${kebabCase(n)}`;
