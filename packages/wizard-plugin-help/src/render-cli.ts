import chalk from 'chalk';
import type { I18n, Wizard } from '@hyperse/wizard-core';
import { INDENT } from './constant.js';
import { table } from './helpers/helper-text-table.js';

export const renderCli = (t: I18n['t'], wizard: Wizard) => {
  const cliMessage: string[] = [];
  const list: string[][] = [];
  const name = t('plugins.helpPlugin.message.name');
  list.push([chalk.bold(name), wizard.name]);

  const version = t('plugins.helpPlugin.message.version');
  list.push([chalk.bold(version), chalk.yellow(wizard.version)]);

  cliMessage.push(table(list));

  const description = t('plugins.helpPlugin.message.description');
  cliMessage.push(chalk.bold(description));
  cliMessage.push(table([[INDENT, wizard.description]]));

  return cliMessage.join('\n\n');
};
