import { LogLevel } from '@hyperse/logger';

/**
 * The root symbol of Command.
 */
export const Root = Symbol.for('Wizard.Root');

/**
 * The name of the root command.
 */
export const rootName = '<Root>';

/**
 * The name of the wizard.
 */
export const WizardName = 'HpsWizard';

/**
 * The default log level.
 */
export const DefaultLogLevel = LogLevel.Info;

/**
 * Whether to use color when logging.
 * @default false
 */
export const DefaultNoColor = false;

/**
 * The regex to check if the message is a wizard plain message.
 */
// eslint-disable-next-line no-useless-escape
export const PlainMessageRegex = /[!\/\<\|\{]/;
