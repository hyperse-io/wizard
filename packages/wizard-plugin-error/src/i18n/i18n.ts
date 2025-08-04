import type { DefineMessageType } from '@hyperse/wizard-core';
import type { errorMessages } from './messages.js';

declare module '@hyperse/wizard-core' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof errorMessages> {}
}
