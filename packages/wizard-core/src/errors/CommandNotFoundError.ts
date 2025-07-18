import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command is not found.
 *
 * @example
 * throw new CommandNotFoundError('en', { cmdName: 'build' });
 */
export class CommandNotFoundError extends CommandI18nError {
  constructor(
    locale: string,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('command.notFound', variables), LogLevel.Error);
  }
}
