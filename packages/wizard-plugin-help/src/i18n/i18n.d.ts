import type { DefineMessageType } from '@hyperse/wizard-core';
import type { helpMessages } from './messages.js';

declare module '@hyperse/wizard-core' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof helpMessages> {}
}
