/**
 * Converts a string to camelCase format.
 * For example: 'hello_world' => 'helloWorld'
 * @param word The input string to convert.
 * @returns The camelCase formatted string.
 */
export const camelCase = (word: string) =>
  word.replace(
    /[\W_]([a-z\d])?/gi,
    // Matches a non-word character or underscore followed by a letter or digit,
    // and uppercases the following character if it exists.
    (_, c) => (c ? c.toUpperCase() : '')
  );
