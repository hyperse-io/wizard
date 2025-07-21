import type { DefineMessageType } from '../../src/types/type-locale-messages.js';
import type { messages } from './messages.js';

declare module '../../src/types/type-locale-messages.js' {
  export interface LocaleMessages extends DefineMessageType<typeof messages> {}
}
