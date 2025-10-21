import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import type {
  CommandName,
  CommandWithI18n,
  FlagsWithI18n,
} from '@hyperse/wizard';
import {
  formatCommandName,
  type PluginSetupWizard,
  rootName,
} from '@hyperse/wizard';

/**
 * Convert wizard flags to Fig spec options
 */
const convertFlagsToFigOptions = (flags: FlagsWithI18n): Fig.Option[] => {
  return Object.entries(flags).map(([name, flag]) => {
    const option: Fig.Option = {
      name: flag.alias ? [`-${flag.alias}`, `--${name}`] : `--${name}`,
      description: flag.description,
    };

    // Check if it's a persistent flag (built-in flags)
    const persistentFlags = [
      'help',
      'version',
      'noColor',
      'logLevel',
      'hpsAppEnv',
      'hpsEnvPath',
      'projectCwd',
    ];
    if (persistentFlags.includes(name)) {
      option.isPersistent = true;
    }

    // Check if it's repeatable (array type)
    if (Array.isArray(flag.type)) {
      option.isRepeatable = true;
    }

    return option;
  });
};

/**
 * Convert a command to Fig subcommand format
 */
const convertCommandToFigSubcommand = <Name extends CommandName>(
  commandMap: Map<string, CommandWithI18n<Name>>,
  command?: CommandWithI18n<Name>,
  commandName?: string
): Fig.Subcommand | undefined => {
  if (!command) {
    return;
  }

  const flagsKeys = Object.keys(command.flags || {});
  const subCommands = command.rawCommand.subCommands;
  return {
    name: String(command.name),
    description:
      typeof command.description === 'string'
        ? command.description
        : 'Command description',
    options:
      flagsKeys.length > 0
        ? flagsKeys.map((key) => {
            const flag = command.flags[key];
            const option: Fig.Option = {
              name: flag.alias ? [`-${flag.alias}`, `--${key}`] : `--${key}`,
              description: flag.description,
            };
            return option;
          })
        : undefined,
    subcommands:
      subCommands && subCommands?.length > 0
        ? (subCommands
            .map((nestedCmd) => {
              const nestedCmdName = `${commandName}.${formatCommandName(nestedCmd.name)}`;
              const cmd = commandMap.get(nestedCmdName);
              return convertCommandToFigSubcommand(
                commandMap,
                cmd,
                nestedCmdName
              );
            })
            .filter(Boolean) as Fig.Subcommand[])
        : undefined,
  };
};

/**
 * Generate Fig spec configuration from wizard instance
 */
const generateFigSpecString = (
  wizard: PluginSetupWizard,
  cliName?: string
): string => {
  // Get the root command
  const commandMap = wizard.commandMap;
  const rootCmd = commandMap.get(rootName);

  if (!rootCmd) {
    throw new Error('Root command not found');
  }

  // Build the main spec
  const spec: Fig.Spec = {
    name: cliName || wizard.name,
    description: wizard.description,
  };

  // Add global flags as root options
  const globalFlags = wizard.globalFlags;
  if (globalFlags && Object.keys(globalFlags).length > 0) {
    spec.options = convertFlagsToFigOptions(globalFlags);
  }

  // Process root command subcommands
  const rawCommand = rootCmd.rawCommand;
  const subCommands = rawCommand.subCommands;
  if (subCommands && subCommands.length > 0) {
    spec.subcommands = subCommands
      .map((subCmd) => {
        const subCmdName = formatCommandName(subCmd.name);
        return convertCommandToFigSubcommand(
          commandMap,
          commandMap.get(subCmdName),
          subCmdName
        );
      })
      .filter(Boolean) as Fig.Subcommand[];
  }

  return JSON.stringify(spec);
};

/**
 * Generate Fig spec as JSON string
 */
export const generateFigSpec = async (
  wizard: PluginSetupWizard,
  cliName?: string
): Promise<string> => {
  const spec = generateFigSpecString(wizard, cliName);
  const outputDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = resolve(outputDir, '../../.fig');
  const outputFile = join(outputPath, `${wizard.name}.js`);
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, {
      recursive: true,
    });
  }
  writeFileSync(
    outputFile,
    `const ${wizard.name} = ${spec};export default ${wizard.name};`
  );
  return outputPath;
};
