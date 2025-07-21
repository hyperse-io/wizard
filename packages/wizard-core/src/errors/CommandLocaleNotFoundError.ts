import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import type { LocaleMessagesKeys } from '../types/type-locale-messages.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command is not found locale.
 *
 * @example
 * throw new CommandLocaleNotFoundError('en', { cmdName: 'build' });
 */
export class CommandLocaleNotFoundError extends CommandI18nError {
  constructor(
    locale: LocaleMessagesKeys,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('core.command.localeNotFound', variables), LogLevel.Error);
  }
}
