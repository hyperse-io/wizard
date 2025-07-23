import type { Paths, RequiredDeep, UnionToTuple, ValueOf } from 'type-fest';
import type { DeepPartial } from '@hyperse/deep-merge';
import type { createTranslator } from '@hyperse/translator';
import type { messages } from '../i18n/messages.js';

/**
 * @description
 * Define message type.
 *
 * @template T - The type of the messages.
 * @returns {T} The message type.
 */
export type DefineMessageType<T> = UnionToTuple<ValueOf<T>>[0];

export type DefaultLocaleMessages = typeof messages;

/**
 * @description
 * Locale messages keys.
 *
 * @returns {SupportedLocales} The locale messages keys.
 */
export type SupportedLocales = keyof DefaultLocaleMessages;

/**
 * @description
 * Default locale messages.
 *
 * @returns {DefaultLocaleMessage} The default locale messages.
 */
export interface DefaultLocaleMessage
  extends DefineMessageType<DefaultLocaleMessages> {}

/**
 * @description
 * Plugin locale messages.
 *
 * @returns {PluginLocaleMessages} The plugin locale messages.
 */
export interface PluginLocaleMessages {}

/**
 * @description
 * Cli locale messages.
 *
 * @returns {CliLocaleMessages} The cli locale messages.
 */
export interface CliLocaleMessages {}

/**
 * @description
 * Locale messages.
 *
 * @returns {LocaleMessages} The locale messages.
 */
export interface LocaleMessages extends DefaultLocaleMessage {
  plugins?: PluginLocaleMessages;
  cli?: CliLocaleMessages;
}

/**
 * @description
 * Locale messages object.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type LocaleMessagesObject = {
  [key in SupportedLocales]: LocaleMessages | string;
};

/**
 * @description
 * Locale messages plugins object.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessagesPluginsObject} The locale messages plugins object.
 */
export type LocaleMessagesPluginsObject = DeepPartial<{
  [key in SupportedLocales]: PluginLocaleMessages;
}>;

/**
 * @description
 * Locale messages cli object.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessagesCliObject} The locale messages cli object.
 */
export type LocaleMessagesCliObject = DeepPartial<{
  [key in SupportedLocales]: CliLocaleMessages;
}>;

/**
 * @description
 * Locale messages paths.
 *
 * @example
 * ```
 * {
 *   'core.cli.name': 'Wizard CLI',
 *   'core.cli.description': 'Wizard CLI description',
 * }
 * ```
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type LocaleMessagesPaths = Paths<LocaleMessages>;

/**
 * @description
 * Locale messages cli paths.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessagesCliPaths} The locale messages cli paths.
 */
export type CliLocaleMessagesPaths = Paths<Pick<LocaleMessages, 'cli'>>;

/**
 * @description
 * Locale message resolver extra options.
 *
 * @returns {LocaleMessageResolverExtraOptions} The locale message resolver extra options.
 */
export type LocaleMessageResolverExtraOptions = {
  commands: string[];
};

/**
 * @description
 * I18n type.
 *
 * @returns {I18n} The I18n type.
 */
export type I18n = {
  t: ReturnType<
    typeof createTranslator<
      RequiredDeep<LocaleMessagesObject>,
      SupportedLocales
    >
  >;
};

/**
 * @description
 * Locale message resolver.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type LocaleMessageResolver =
  | LocaleMessagesPaths
  | ((
      t: I18n['t'],
      extraOptions?: LocaleMessageResolverExtraOptions
    ) => string);

/**
 * @description
 * Cli locale message resolver.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type CliLocaleMessageResolver =
  | CliLocaleMessagesPaths
  | ((
      t: I18n['t'],
      extraOptions?: LocaleMessageResolverExtraOptions
    ) => string);
