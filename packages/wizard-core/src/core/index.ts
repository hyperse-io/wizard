import type { WizardOptions } from '../types/typeWizard.js';
import { Wizard } from './Wizard.js';

/**
 * @description
 * Create a new wizard instance.
 *
 * @docsCategory core
 * @docsPage Create Wizard
 * @param options The options for the wizard.
 * @returns The wizard instance.
 */
export const createWizard = (options: WizardOptions) => {
  return new Wizard(options);
};
