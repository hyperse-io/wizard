import type {
  I18n,
  LocaleMessageResolver,
} from '../types/type-locale-messages.js';

/**
 * @description
 * Resolves the value of a locale message.
 *
 * @param t The i18n instance.
 * @param localResolver The locale message resolver.
 * @returns The value of the locale message.
 */
export const localeMessageValue = (
  t: I18n['t'],
  localResolver: LocaleMessageResolver
) => {
  if (typeof localResolver === 'function') {
    return localResolver(t);
  }
  return t(localResolver);
};
