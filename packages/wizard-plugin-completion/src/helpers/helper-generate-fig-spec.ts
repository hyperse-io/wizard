import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path/posix';
import { fileURLToPath } from 'url';
import type { FlagsWithI18n } from '@hyperse/wizard';
import { type PluginSetupWizard, rootName } from '@hyperse/wizard';

/**
 * Convert wizard flags to Fig spec options
 */
const convertFlagsToFigOptions = (flags: FlagsWithI18n): Fig.Option[] => {
  return Object.entries(flags).map(([name, flag]) => {
    const option: Fig.Option = {
      name: flag.alias ? [flag.alias, `--${name}`] : `--${name}`,
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
const convertCommandToFigSubcommand = (command: any): Fig.Subcommand => {
  return {
    name: String(command.name),
    description:
      typeof command.description === 'string'
        ? command.description
        : 'Command description',
    options: Object.keys(command.flags || {}).length > 0 ? [] : undefined,
    subcommands:
      command.subCommands && command.subCommands.length > 0
        ? command.subCommands.map((nestedCmd: any) =>
            convertCommandToFigSubcommand(nestedCmd)
          )
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
    spec.subcommands = subCommands.map((subCmd) =>
      convertCommandToFigSubcommand(subCmd)
    );
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
