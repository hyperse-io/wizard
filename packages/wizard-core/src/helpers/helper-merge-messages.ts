import type {
  LocaleMessages,
  LocaleMessagesCliObject,
  LocaleMessagesObject,
  LocaleMessagesPluginsObject,
} from '../types/type-locale-messages.js';

/**
 * @description
 * Merge locale messages.
 *
 * @param originalMessage The original message.
 * @param targetMessage The target message.
 * @returns The merged message.
 */
export const mergeMessages = <
  OriginalMessage extends
    | LocaleMessagesObject
    | LocaleMessagesPluginsObject
    | LocaleMessagesCliObject,
>(
  path: keyof LocaleMessages,
  originalMessage?: OriginalMessage,
  targetMessage?: LocaleMessagesPluginsObject | LocaleMessagesCliObject
): OriginalMessage => {
  const result: OriginalMessage = {} as OriginalMessage;

  const keys = Object.keys(
    originalMessage ?? {}
  ) as (keyof LocaleMessagesObject)[];

  for (const key of keys) {
    const findTargetValue = targetMessage?.[key] ?? {};
    result[key] = Object.assign({}, originalMessage?.[key] ?? {}, {
      [path]: findTargetValue,
    }) as LocaleMessagesObject[keyof LocaleMessagesObject];
  }
  return result;
};
