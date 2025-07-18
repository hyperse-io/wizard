import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command is not found.
 *
 * @example
 * throw new CommandHandlerNotFoundError('en', { cmdName: 'build' });
 */
export class CommandHandlerNotFoundError extends CommandI18nError {
  constructor(
    locale: string,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('command.handlerNotFound', variables), LogLevel.Error);
  }
}
