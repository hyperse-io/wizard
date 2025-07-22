import type {
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
  return Object.assign({}, originalMessage, targetMessage);
};
