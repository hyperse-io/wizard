import {
  type CommandName,
  type CommandWithI18n,
  formatCommandName,
  type I18n,
  type PluginSetupWizard,
  Root,
} from '@hyperse/wizard';
import { INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderUsage = <Name extends CommandName>(
  t: I18n['t'],
  wizard: PluginSetupWizard,
  command: CommandWithI18n<Name>
) => {
  const usageMessage: string[] = [];
  const usage = t('plugins.helpPlugin.message.usage');
  usageMessage.push(usage);

  const cliName = wizard.name;
  const commandChainNames = wizard.commandChain
    .filter((command) => command.name !== Root)
    .map((command) => formatCommandName(command.name));

  const showFlags = Object.keys(command.flags || {}).length > 0;
  const flagsString = showFlags ? ' [flags]' : '';
  usageMessage.push(
    table([
      [
        INDENT,
        chalk.blue(
          `$ ${[cliName, ...commandChainNames].join(' ')}${flagsString}`
        ),
      ],
    ])
  );

  return usageMessage.join('\n');
};
