import chalk from 'chalk';
import type { CommandName, CommandWithI18n, I18n } from '@hyperse/wizard-core';
import { INDENT } from '../constant.js';
import { table } from '../helpers/helper-text-table.js';

export const renderExample = <Name extends CommandName>(
  t: I18n['t'],
  command: CommandWithI18n<Name>
) => {
  const example = command.example;
  if (!example) {
    return;
  }

  const exampleMessage: string[] = [];
  const exampleTitle = t('plugins.helpPlugin.message.examples');
  exampleMessage.push(chalk.bold(exampleTitle));

  exampleMessage.push(table([[INDENT, example]]));

  return exampleMessage.join('\n\n');
};
