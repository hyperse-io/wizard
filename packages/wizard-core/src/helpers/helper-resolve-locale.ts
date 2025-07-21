import type { LocaleMessagesKeys } from '../types/type-locale-messages.js';

/**
 * Resolves the locale of the system.
 *
 * @returns The locale of the system.
 */
export const resolveLocale = (): LocaleMessagesKeys => {
  const defaultLocale = process.env.HPS_WIZARD_LOCALE
    ? process.env.HPS_WIZARD_LOCALE
    : Intl.DateTimeFormat().resolvedOptions().locale;

  if (defaultLocale.startsWith('en')) {
    return 'en';
  }

  return defaultLocale as LocaleMessagesKeys;
};
