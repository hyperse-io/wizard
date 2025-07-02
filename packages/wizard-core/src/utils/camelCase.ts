/**
 * @description
 * Convert a word to camel case.
 *
 * @docsCategory utils
 * @docsPage Case
 * @param word The word to convert.
 * @returns The camel case word.
 */
export const camelCase = (word: string) =>
  word.replace(/[\W_]([a-z\d])?/gi, (_, c) => (c ? c.toUpperCase() : ''));
