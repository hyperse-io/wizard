import type { Paths, UnionToTuple, ValueOf } from 'type-fest';
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

/**
 * @description
 * I18n type.
 *
 * @returns {I18n} The I18n type.
 */
export type I18n = {
  t: ReturnType<
    typeof createTranslator<LocaleMessagesObject, LocaleMessagesKeys>
  >;
};

export type DefaultLocaleMessages = typeof messages;

/**
 * @description
 * Locale messages keys.
 *
 * @returns {LocaleMessagesKeys} The locale messages keys.
 */
export type LocaleMessagesKeys = keyof DefaultLocaleMessages;

/**
 * @description
 * Default locale messages.
 *
 * @returns {DefaultLocaleMessage} The default locale messages.
 */
export type DefaultLocaleMessage = DefineMessageType<DefaultLocaleMessages>;

/**
 * @description
 * Locale messages.
 *
 * @returns {LocaleMessages} The locale messages.
 */
export interface LocaleMessages extends DefaultLocaleMessage {}

/**
 * @description
 * Locale messages object.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type LocaleMessagesObject = {
  [key in LocaleMessagesKeys]: LocaleMessages | string;
};

/**
 * @description
 * Locale messages object without default.
 *
 * @template key - The key of the locale messages.
 * @returns {LocaleMessages | string} The locale messages.
 */
export type LocaleMessagesObjectWithoutDefault = DeepPartial<{
  [key in keyof LocaleMessagesObject]?: Omit<
    LocaleMessages,
    keyof DefaultLocaleMessage
  >;
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

export type LocaleMessageResolverExtraOptions = {
  commands: string[];
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
