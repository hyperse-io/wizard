import type { MaybeArray } from '../types/type-utils.js';

/**
 * @description
 * Convert a single value or an array to an array.
 *
 * @docsCategory utils
 * @docsPage Array
 * @param a The value or array to convert.
 * @returns The array.
 */
export const toArray = <T>(a: MaybeArray<T>) => (Array.isArray(a) ? a : [a]);

/**
 * @description
 * Check if two arrays are equal.
 *
 * @docsCategory utils
 * @docsPage Array
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns True if the arrays are equal, false otherwise.
 */
export function arrayEquals<T>(arr1: T[], arr2: T[]) {
  if (arr2.length !== arr1.length) {
    return false;
  }

  return arr1.every((item, i) => item === arr2[i]);
}

/**
 * @description
 * Check if an array starts with another array.
 *
 * @docsCategory utils
 * @docsPage Array
 * @param arr The array to check.
 * @param start The array to check if it starts with.
 * @returns True if the array starts with the other array, false otherwise.
 */
export function arrayStartsWith<T>(arr: T[], start: T[]) {
  if (start.length > arr.length) {
    return false;
  }

  return arrayEquals(arr.slice(0, start.length), start);
}
