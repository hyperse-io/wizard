import type {
  I18n,
  LocaleMessageResolver,
  LocaleMessageResolverExtraOptions,
  LocaleMessagesPaths,
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
  localResolver: LocaleMessagesPaths | LocaleMessageResolver,
  extraOptions?: LocaleMessageResolverExtraOptions
) => {
  if (typeof localResolver === 'function') {
    return localResolver(t, extraOptions);
  }

  return t(localResolver);
};
