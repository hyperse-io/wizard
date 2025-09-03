import type { Logger } from '@hyperse/logger';
import { createTranslator } from '@hyperse/translator';
import { PlainMessageRegex } from '../constants.js';
import type {
  I18n,
  LocaleMessagesObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';
import { coreMessages } from './messages.js';

const createFallbackTranslator = (
  locale: SupportedLocales,
  messages: LocaleMessagesObject,
  logger?: Logger
) => {
  return createTranslator<LocaleMessagesObject, SupportedLocales>({
    messages: messages,
    locale: 'en',
    namespace: 'en',
    onError: () => {},
    getMessageFallback: ({ error, key }) => {
      if (error && logger) {
        logger.debug(error.message);
      }
      return `${locale}.${key}`;
    },
    plainMessageCheck(message) {
      return PlainMessageRegex.test(message);
    },
  });
};

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
  messages: LocaleMessagesObject = coreMessages,
  logger?: Logger
): I18n['t'] => {
  const fallbackTranslator = createFallbackTranslator(locale, messages, logger);
  return createTranslator<LocaleMessagesObject, SupportedLocales>({
    locale: locale,
    messages: messages,
    namespace: locale,
    onError: () => {
      // Prevent internal translator errors from leaking out without I18n handling
    },
    getMessageFallback: ({ error, key, namespace }) => {
      if (error && logger) {
        logger.debug(error.message);
      }
      if (namespace === 'en') {
        return `${namespace}.${key}`;
      }
      return fallbackTranslator(key);
    },
    plainMessageCheck(message) {
      return PlainMessageRegex.test(message);
    },
  });
};
