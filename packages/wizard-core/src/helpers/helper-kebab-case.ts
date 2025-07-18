import type { KebabCase } from '../types/type-case.js';

/**
 * Converts a string to kebab-case format.
 * For example: 'helloWorld' => 'hello-world'
 * @param s The input string to convert.
 * @returns The kebab-case formatted string.
 */
export const kebabCase = <T extends string>(s: T) =>
  s.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`) as KebabCase<T>;
