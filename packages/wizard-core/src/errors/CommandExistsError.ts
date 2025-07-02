import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command already exists.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class CommandExistsError extends CommandI18nError {
  constructor(
    locale: string,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('command.nameConflict', variables), LogLevel.Error);
  }
}
