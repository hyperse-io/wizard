import { type DeepPartial, mergeOptions } from '@hyperse/deep-merge';
import { DefaultLogLevel, DefaultNoColor } from './constants.js';
import { Wizard, type WizardWithUse } from './core/Wizard.js';
import type { WizardOptions } from './types/type-wizard.js';

/**
 * @description
 * Create a new wizard instance.
 *
 * @param options The options for the wizard.
 * @returns The wizard instance.
 */
export const createWizard = (options: WizardOptions): WizardWithUse => {
  const defaultOptions: DeepPartial<WizardOptions> = {
    noColor: DefaultNoColor,
    logLevel: DefaultLogLevel,
  };
  const finalOptions = mergeOptions(defaultOptions, options) as Exclude<
    WizardOptions,
    'logLevel' | 'noColor'
  > &
    Required<Pick<WizardOptions, 'logLevel' | 'noColor'>>;

  return new Wizard(finalOptions);
};
