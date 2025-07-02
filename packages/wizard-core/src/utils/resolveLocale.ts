/**
 * @description
 * Detect the locale of the system.
 *
 * @docsCategory utils
 * @docsPage resolveLocale
 * @returns The locale of the system.
 */
export const resolveLocale = () =>
  process.env.HPS_WIZARD_LOCALE
    ? process.env.HPS_WIZARD_LOCALE
    : Intl.DateTimeFormat().resolvedOptions().locale;
