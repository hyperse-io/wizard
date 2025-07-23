import type { Logger } from '@hyperse/logger';
import { createTranslator } from '@hyperse/translator';
import type {
  I18n,
  LocaleMessagesObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';
import { messages as defaultMessages } from './messages.js';

/**
 * @description
 * Use the locale.
 *
 * @param locale The locale to use.
 * @param messages The messages to use.
 * @param logger The logger to use.
 * @returns The translator.
 *
 * @example
 * const t = useLocale('en');
 * t('command.notFound', { cmdName: 'build' });
 */
export const useLocale = (
  locale: SupportedLocales,
  messages: LocaleMessagesObject = defaultMessages as unknown as LocaleMessagesObject,
  logger?: Logger
): I18n['t'] => {
  return createTranslator<LocaleMessagesObject, SupportedLocales>({
    locale: locale,
    messages: messages,
    namespace: locale,
    onError: () => {
      // Prevent internal translator errors from leaking out without I18n handling
    },
    getMessageFallback: ({ error, key, namespace }) => {
      if (error && logger) {
        logger.warn(error.message);
      }
      return `${namespace}.${key}`;
    },
  });
};
