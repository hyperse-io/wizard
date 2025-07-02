import type { LogLevel } from '@hyperse/logger';
import type { Root } from '../constants.js';

/**
 * @description
 * The root type of the wizard.
 *
 * @docsCategory types
 * @docsPage Root Type
 */
export type RootType = typeof Root;

/**
 * @description
 * The options for the wizard.
 *
 * @docsCategory types
 * @docsPage Wizard Options
 */
export type WizardOptions = {
  name: string;
  description: string;
  version: string;
  thresholdLogLevel?: LogLevel;
  noColor?: boolean;
};

/**
 * @description
 * The options for the parse method.
 *
 * @docsCategory types
 * @docsPage Wizard Options
 */
export type ParseOptions = {
  argv?: string[];
  run?: boolean;
};
