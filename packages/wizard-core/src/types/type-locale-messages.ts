import type { Paths, UnionToTuple, ValueOf } from 'type-fest';
import type { createTranslator } from '@hyperse/translator';
import type { messages } from '../i18n/messages.js';

export type DefineMessageType<T> = UnionToTuple<ValueOf<T>>[0];

export type I18n = {
  t: ReturnType<
    typeof createTranslator<LocaleMessagesObject, LocaleMessagesKeys>
  >;
};

export type LocaleMessagesKeys = keyof typeof messages;

export type DefaultLocaleMessages = DefineMessageType<typeof messages>;

export interface LocaleMessages extends DefaultLocaleMessages {}

export type LocaleMessagesObject = {
  [key in LocaleMessagesKeys]: LocaleMessages | string;
};

export type LocaleMessagesObjectWithoutDefault = {
  [key in keyof LocaleMessagesObject]?: Omit<
    LocaleMessages,
    keyof DefaultLocaleMessages
  >;
};

export type LocaleMessagesPaths = Paths<LocaleMessages>;

export type LocaleMessageResolver =
  | LocaleMessagesPaths
  | ((t: I18n['t']) => string);
