import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import type { LocaleMessagesKeys } from '../types/type-locale-messages.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command name is invalid.
 *
 * @example
 * throw new InvalidCommandNameError('en', { cmdName: 'build' });
 */
export class InvalidCommandNameError extends CommandI18nError {
  constructor(
    locale: LocaleMessagesKeys,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('core.command.invalidName', variables), LogLevel.Error);
  }
}
