import type { KebabCase } from '../types/type-case.js';

/**
 * @description
 * Convert a word to kebab case.
 *
 * @docsCategory utils
 * @docsPage Case
 * @param s The word to convert.
 * @returns The kebab case word.
 */
export const kebabCase = <T extends string>(s: T) =>
  s.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`) as KebabCase<T>;
