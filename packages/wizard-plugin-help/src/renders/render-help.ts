import type { CommandName, CommandWithI18n, I18n } from '@hyperse/wizard';
import { INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderHelp = <Name extends CommandName>(
  t: I18n['t'],
  command: CommandWithI18n<Name>
) => {
  const help = command.help;
  if (!help) {
    return;
  }

  const helpMessage: string[] = [];
  const helpTitle = t('plugins.helpPlugin.message.help');
  helpMessage.push(helpTitle);

  helpMessage.push(table([[INDENT, help]]));

  return helpMessage.join('\n');
};
