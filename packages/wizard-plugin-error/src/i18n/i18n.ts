import type { DefineMessageType } from '@hyperse/wizard';
import type { errorMessages } from './messages.js';

declare module '@hyperse/wizard' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof errorMessages> {}
}
