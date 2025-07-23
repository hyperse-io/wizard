import type { DefineMessageType } from '../../src/types/type-locale-messages.js';
import type { cliMessages, messages } from './messages.js';

declare module '../../src/types/type-locale-messages.js' {
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof messages> {}

  export interface CliLocaleMessages
    extends DefineMessageType<typeof cliMessages> {}
}
