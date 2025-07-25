import type { FlagsWithI18n } from '../types/type-flag.js';
import type { I18n } from '../types/type-locale-messages.js';
import type { GlobalFlags } from '../types/type-wizard.js';
import { localeMessageValue } from './helper-locale-message-value.js';

/**
 * @description
 * Converts a global flags to a map of global flags with i18n.
 *
 * @param t - The i18n instance.
 * @param globalFlags - The global flags to convert.
 */
export const globalFlagsWithI18n = (
  t: I18n['t'],
  globalFlags: GlobalFlags
): FlagsWithI18n => {
  const i18nGlobalFlags: FlagsWithI18n = {};

  for (const [name, flag] of globalFlags.entries()) {
    i18nGlobalFlags[name] = {
      ...flag,
      description: localeMessageValue(t, flag.description),
    };
  }
  return i18nGlobalFlags;
};
