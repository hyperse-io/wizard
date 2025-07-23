import { LogLevel } from '@hyperse/logger';
import { useLocale } from '../i18n/index.js';
import type { SupportedLocales } from '../types/type-locale-messages.js';
import { CommandI18nError } from './CommandI18nError.js';

/**
 * @description
 * This error should be thrown when a command flag is not provided.
 *
 * @example
 * throw new CommandFlagNotProviderError('en', {
 *   cmdName: 'build',
 *   flagName: 'projectCwd',
 * });
 */
export class CommandFlagNotProviderError extends CommandI18nError {
  constructor(
    locale: SupportedLocales,
    variables: { [key: string]: string | number } = {}
  ) {
    const t = useLocale(locale);
    super(t('core.command.flagNotProvided', variables), LogLevel.Error);
  }
}
