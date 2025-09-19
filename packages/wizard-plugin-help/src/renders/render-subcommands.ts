import {
  type CommandName,
  type CommandWithI18n,
  formatCommandName,
  type I18n,
  type PluginSetupWizard,
  Root,
} from '@hyperse/wizard';
import { DELIMITER, INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderSubcommands = (t: I18n['t'], wizard: PluginSetupWizard) => {
  const commandChain = wizard.commandChain;
  const lastCommand = commandChain[commandChain.length - 1];

  if (lastCommand.name === Root) {
    return;
  }

  const subcommands = lastCommand.rawCommand.subCommands || [];
  if (!subcommands.length) {
    return;
  }

  const commandChainNames = wizard.commandChain
    .filter((command) => command.name !== Root)
    .map((command) => formatCommandName(command.name));
  const parentCommandNames = [wizard.name, ...commandChainNames];

  const commandMap = wizard.commandMap;
  const subcommandNameToDescription = subcommands
    .map((commandItem) => {
      const subcommand = commandMap.get(
        [commandChainNames, formatCommandName(commandItem.name)].join('.')
      );
      if (!subcommand) {
        return [];
      }
      return [
        INDENT,
        chalk.blue(
          [...parentCommandNames, formatCommandName(commandItem.name)].join(' ')
        ),
        chalk.yellow(DELIMITER),
        subcommand.description,
      ];
    })
    .filter((item) => item.length > 0);

  const subcommandsMessage: string[] = [];
  const subcommandsTitle = t('plugins.helpPlugin.message.subcommand');
  subcommandsMessage.push(subcommandsTitle);

  subcommandsMessage.push(table(subcommandNameToDescription));

  return subcommandsMessage.join('\n');
};
