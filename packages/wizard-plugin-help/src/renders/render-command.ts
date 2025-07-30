import {
  type CommandName,
  type CommandWithI18n,
  formatCommandName,
  type I18n,
  Root,
  type Wizard,
} from '@hyperse/wizard-core';
import { DELIMITER, INDENT } from '../constant.js';
import { chalk } from '../helpers/helper-chalk.js';
import { table } from '../helpers/helper-text-table.js';

export const renderCommand = <Name extends CommandName>(
  t: I18n['t'],
  command: CommandWithI18n<Name>,
  wizard: Wizard
) => {
  if (command.name !== Root) {
    return;
  }
  const subcommands = command.rawCommand.subCommands || [];
  if (!subcommands.length) {
    return;
  }

  const subcommandNames = subcommands.map((subcommand) => subcommand.name);
  const commandMap = wizard.commandMap;
  const subcommandNameToDescription = subcommandNames
    .map((subcommandName) => {
      const subcommand = commandMap.get(subcommandName);
      if (!subcommand) {
        return [];
      }
      return [
        INDENT,
        chalk.cyan([wizard.name, formatCommandName(subcommandName)].join(' ')),
        chalk.yellow(DELIMITER),
        subcommand.description,
      ];
    })
    .filter((item) => item.length > 0);

  const subcommandsMessage: string[] = [];
  const subcommandsTitle = t('plugins.helpPlugin.message.commands');
  subcommandsMessage.push(chalk.bold(subcommandsTitle));

  subcommandsMessage.push(table(subcommandNameToDescription));

  return subcommandsMessage.join('\n\n');
};
