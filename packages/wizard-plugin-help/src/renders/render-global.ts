import type { I18n, Wizard } from '@hyperse/wizard';
import { chalk } from '../helpers/helper-chalk.js';
import { formatFlags } from '../helpers/helper-format-flags.js';
import { table } from '../helpers/helper-text-table.js';

export const renderGlobal = (t: I18n['t'], wizard: Wizard) => {
  const globalFlags = wizard.globalFlags;
  const globalMessage: string[] = [];

  const global = t('plugins.helpPlugin.message.globalFlags');
  globalMessage.push(chalk.bold(global));

  const tableMessage: string[][] = formatFlags(t, globalFlags);
  globalMessage.push(table(tableMessage));

  return globalMessage.join('\n\n');
};
