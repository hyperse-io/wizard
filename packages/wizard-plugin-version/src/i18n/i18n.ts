import type { DefineMessageType } from '@hyperse/wizard';
import type { versionMessages } from './messages.js';

declare module '@hyperse/wizard' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof versionMessages> {}
}
