import chalk from 'chalk';
import type { FlagsWithI18n, I18n } from '@hyperse/wizard-core';
import { formatFlags } from '../helpers/helper-format-flags.js';
import { table } from '../helpers/helper-text-table.js';

export const renderFlags = (t: I18n['t'], flags: FlagsWithI18n) => {
  if (Object.keys(flags).length === 0) {
    return;
  }
  const flagsMessage: string[] = [];
  const flagTitle = t('plugins.helpPlugin.message.flags');
  flagsMessage.push(chalk.bold(flagTitle));

  const tableMessage: string[][] = formatFlags(t, flags);
  flagsMessage.push(table(tableMessage));

  return flagsMessage.join('\n\n');
};
