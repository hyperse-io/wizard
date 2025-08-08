import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command process is not found.
 *
 * @example
 * throw new CommandProcessNotFoundError('en', { cmdName: 'build' });
 */
export class CommandProcessNotFoundError extends CommandI18nError {
  constructor(
    public locale: SupportedLocales,
    public variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('core.command.processNotFound', variables), LogLevel.Error);
  }
}
