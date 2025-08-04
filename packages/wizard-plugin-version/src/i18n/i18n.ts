import type { DefineMessageType } from '@hyperse/wizard-core';
import type { versionMessages } from './messages.js';

declare module '@hyperse/wizard-core' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof versionMessages> {}
}
