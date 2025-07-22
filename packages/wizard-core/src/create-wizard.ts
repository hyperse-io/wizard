import { Wizard } from './core/Wizard.js';
import type { WizardOptions } from './types/type-wizard.js';

/**
 * @description
 * Create a new wizard instance.
 *
 * @param options The options for the wizard.
 * @returns The wizard instance.
 */
export const createWizard = (options: WizardOptions) => {
  return new Wizard(options);
};
