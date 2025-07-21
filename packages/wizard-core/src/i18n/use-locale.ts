import { createTranslator } from '@hyperse/translator';
import type {
  I18n,
  LocaleMessagesKeys,
  LocaleMessagesObject,
} from '../types/type-locale-messages.js';
import { messages as defaultMessages } from './messages.js';

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
export const useLocale = (
  locale: LocaleMessagesKeys,
  messages: LocaleMessagesObject = defaultMessages as unknown as LocaleMessagesObject
): I18n['t'] => {
  return createTranslator<LocaleMessagesObject, LocaleMessagesKeys>({
    locale: locale,
    messages: messages,
    namespace: locale,
  });
};
