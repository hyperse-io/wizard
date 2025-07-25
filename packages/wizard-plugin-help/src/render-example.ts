import chalk from 'chalk';
import type { I18n, Wizard } from '@hyperse/wizard-core';

export const renderUsage = (t: I18n['t'], wizard: Wizard) => {
  const usageMessage: string[] = [];
  const usage = t('plugins.helpPlugin.message.usage');
  usageMessage.push(chalk.bold(usage));

  return usageMessage.join('\n\n');
};
