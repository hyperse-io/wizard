import { createTranslator } from '@hyperse/translator';
import { messages } from './messages.js';

/**
 * @description
 * Use the locale.
 *
 * @param locale The locale to use.
 * @returns The translator.
 *
 * @example
 * const t = useLocale('en');
 * t('command.notFound', { cmdName: 'build' });
 */
export const useLocale = (locale: string) => {
  return createTranslator({
    locale: locale,
    messages: messages,
    namespace: locale as 'en',
  });
};
