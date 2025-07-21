import { CommandLocaleNotFoundError } from '../errors/CommandLocaleNotFoundError.js';
import type {
  I18n,
  LocaleMessageResolver,
  LocaleMessagesKeys,
} from '../types/type-locale-messages.js';

export const localeMessageValue = (
  localKey: string,
  locale: LocaleMessagesKeys,
  t: I18n['t'],
  localResolver: LocaleMessageResolver
) => {
  try {
    if (typeof localResolver === 'function') {
      return localResolver(t);
    }
    return t(localResolver);
  } catch {
    throw new CommandLocaleNotFoundError(locale, {
      cmdName: localKey,
    });
  }
};
