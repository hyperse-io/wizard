import type { DefineMessageType, SupportedLocales } from '@hyperse/wizard-core';
import type { helpMessages } from './messages.js';

export type HelpPluginLocaleOverrideMessages = {
  [key in SupportedLocales]: {
    helpPlugin: {
      banner: string;
      footer: string;
    };
  };
};

export type HelpPluginLocaleMessages = {
  [K in keyof DefineMessageType<typeof helpMessages>]: DefineMessageType<
    typeof helpMessages
  >[K] &
    DefineMessageType<HelpPluginLocaleOverrideMessages>['helpPlugin'];
};

declare module '@hyperse/wizard-core' {
  export interface PluginLocaleMessages extends HelpPluginLocaleMessages {}
}
