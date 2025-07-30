import { type DeepPartial, mergeOptions } from '@hyperse/deep-merge';
import type {
  LocaleMessages,
  LocaleMessagesCliObject,
  LocaleMessagesObject,
  LocaleMessagesPluginsObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';

/**
 * @description
 * Merge locale messages.
 *
 * @param originalMessage The original message.
 * @param targetMessage The target message.
 * @returns The merged message.
 */
export const mergeLocaleMessages = (
  path: keyof LocaleMessages,
  originalMessage: LocaleMessagesObject,
  targetMessage: LocaleMessagesPluginsObject | LocaleMessagesCliObject = {}
): LocaleMessagesObject => {
  const newTargetMessage: DeepPartial<LocaleMessagesObject> = {};
  for (const locale of Object.keys(targetMessage) as SupportedLocales[]) {
    newTargetMessage[locale] = {
      [path]: targetMessage[locale],
    };
  }

  const finalMessage = mergeOptions(originalMessage, newTargetMessage);
  return finalMessage;
};
