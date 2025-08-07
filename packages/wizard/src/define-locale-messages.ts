import type { SupportedLocales } from './types/type-locale-messages.js';

/**
 * @description
 * Helper function to define locale messages for type inference and IDE autocompletion.
 * This function does not modify the input messages object; it is only used for type annotation and code hints.
 *
 * @template Messages - The type of the messages object, which should be an object with SupportedLocales as keys.
 * @param messages - The locale messages object, where each key is a supported locale (e.g., 'en', 'zh'), and the value is the corresponding messages for that locale.
 * @returns The input locale messages object with its type preserved.
 */
export const defineLocaleMessages = <
  Messages extends Record<SupportedLocales, any>,
>(
  messages: Messages
): Messages => {
  return messages;
};
