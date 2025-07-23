import type {
  LocaleMessagesKeys,
  LocaleMessagesObject,
  LocaleMessagesObjectWithoutDefault,
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
    | LocaleMessagesObjectWithoutDefault,
>(
  originalMessage?: OriginalMessage,
  targetMessage?: LocaleMessagesObjectWithoutDefault
): OriginalMessage => {
  const result: OriginalMessage = {} as OriginalMessage;

  const keys = Object.keys(
    originalMessage ?? {}
  ) as (keyof LocaleMessagesObject)[];

  for (const key of keys) {
    const findTargetValue = targetMessage?.[key] ?? {};
    result[key] = Object.assign(
      {},
      originalMessage?.[key] ?? {},
      findTargetValue
    ) as LocaleMessagesObject[keyof LocaleMessagesObject];
  }
  return result;
};
