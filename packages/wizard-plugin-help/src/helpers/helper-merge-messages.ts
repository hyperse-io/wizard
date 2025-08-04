import { type DeepPartial, mergeOptions } from '@hyperse/deep-merge';
import type { LocaleMessagesPluginsObject } from '@hyperse/wizard-core';
import type { HelpPluginLocaleOverrideMessages } from '../i18n/i18n.js';

/**
 * Merge locale message objects.
 *
 * @param messages The default locale message object.
 * @param overrideMessages User-defined locale message overrides.
 * @returns The merged locale message object, with values from overrideMessages taking precedence over messages, and any non-overridden values preserved from messages.
 */
export const mergeMessages = (
  messages: LocaleMessagesPluginsObject,
  overrideMessages: DeepPartial<HelpPluginLocaleOverrideMessages> = {}
) => {
  return mergeOptions(messages, overrideMessages);
};
