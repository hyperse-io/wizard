import { createTranslator } from '@hyperse/translator';
import { messages } from './messages.js';

/**
 * @description
 * Use the locale.
 *
 * @docsCategory i18n
 * @docsPage Use Locale
 * @param locale The locale to use.
 * @returns The translator.
 */
export const useLocale = (locale: string) => {
  return createTranslator({
    locale: locale,
    messages: messages,
    namespace: locale as 'en',
  });
};
