import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command is not provided.
 *
 * @example
 * throw new CommandNotProviderError('en');
 */
export class CommandNotProviderError extends CommandI18nError {
  constructor(locale: SupportedLocales) {
    const t = useLocale(locale);
    super(t('core.command.notProvider'), LogLevel.Error);
  }
}
