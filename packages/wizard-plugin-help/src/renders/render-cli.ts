import {
  type CommandName,
  type CommandWithI18n,
  type I18n,
  type PluginSetupWizard,
  Root,
} from '@hyperse/wizard';
import { INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderCli = <Name extends CommandName>(
  t: I18n['t'],
  wizard: PluginSetupWizard,
  lastCommand?: CommandWithI18n<Name>
) => {
  const cliMessage: string[] = [];
  const list: string[][] = [];
  const name = t('plugins.helpPlugin.message.name');
  list.push([name, wizard.name]);

  const version = t('plugins.helpPlugin.message.version');
  list.push([version, chalk.yellow(wizard.version)]);

  cliMessage.push(table(list));

  const description = t('plugins.helpPlugin.message.description');
  cliMessage.push(description);

  if (lastCommand && lastCommand.name !== Root) {
    cliMessage.push(table([[INDENT, lastCommand.description]]));
  } else {
    cliMessage.push(table([[INDENT, wizard.description]]));
  }

  return cliMessage.join('\n');
};
