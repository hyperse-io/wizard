import {
  type CommandName,
  type CommandWithI18n,
  type I18n,
  Root,
  type Wizard,
} from '@hyperse/wizard-core';
import { INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderCli = <Name extends CommandName>(
  t: I18n['t'],
  wizard: Wizard,
  lastCommand?: CommandWithI18n<Name>
) => {
  const cliMessage: string[] = [];
  const list: string[][] = [];
  const name = t('plugins.helpPlugin.message.name');
  list.push([chalk.bold(name), wizard.name]);

  const version = t('plugins.helpPlugin.message.version');
  list.push([chalk.bold(version), chalk.yellow(wizard.version)]);

  cliMessage.push(table(list));

  const description = t('plugins.helpPlugin.message.description');
  cliMessage.push(chalk.bold(description));

  if (lastCommand && lastCommand.name !== Root) {
    cliMessage.push(table([[INDENT, lastCommand.description]]));
  } else {
    cliMessage.push(table([[INDENT, wizard.description]]));
  }

  return cliMessage.join('\n\n');
};
