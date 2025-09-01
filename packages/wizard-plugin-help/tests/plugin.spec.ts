import {
  createWizard,
  defineCommand,
  type DefineMessageType,
  definePlugin,
} from '@hyperse/wizard';
import { createHelpPlugin } from '../src/create-help-plugin.js';
import type { buildPluginMessages } from './i18n/message.js';
import { helpCliMessages } from './i18n/message.js';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof helpCliMessages> {}

  export interface PluginLocaleMessages
    extends DefineMessageType<typeof buildPluginMessages> {}
}

const printer = vi.fn();
const originalPrinter = process.stdout.write;

describe('createHelpPlugin - CLI help functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = printer;
  });

  afterEach(() => {
    process.stdout.write = originalPrinter;
  });

  const evolve = defineCommand('evolve', {
    description: () => 'evolve description',
  }).flags({
    evolveName: {
      type: String,
      default: 'evolveName',
      description: () => 'evolve command description',
    },
  });

  const deploy = defineCommand('deploy', {
    description: () => 'deploy description',
  }).flags({
    deployName: {
      type: String,
      default: 'deploy',
      description: () => 'deploy command description',
    },
  });

  const cli = createWizard({
    name: 'hps_cli',
    description: 'cli.helpCli.description',
    version: () => '1.0.0',
    localeMessages: helpCliMessages,
    errorHandler: (e) => {
      console.log('CLI errorHandler \n', e);
    },
  })
    .use(
      createHelpPlugin({
        showBanner: true,
        showFooter: true,
        overrideLocaleMessages: {
          en: {
            helpPlugin: {
              banner: '🎉🎉🎉Wizard cli is published by hps🎉🎉🎉',
              footer: '@2025 wizard-plugin-help',
            },
          },
        },
      })
    )
    .use(
      definePlugin({
        name: () => 'test plugin',
        setup: (cli) => {
          return cli.register(
            defineCommand('build', {
              description: () => 'A build command',
              example: () => 'A build command example',
            })
              .use(evolve, deploy)
              .flags({
                buildType: {
                  type: String,
                  default: 'build',
                  alias: 't',
                  description: () => 'build command type',
                },
              })
          );
        },
      })
    );

  /**
   * Banner
   * Name
   * Version
   * Description
   * CLI description
   * Usage
   * Commands
   * Global Flags
   * Footer
   */
  it('should display main CLI help when using -h flag', async () => {
    await cli.parse(['-h']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    const result = printer.mock.calls[0][0];
    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('CLI description');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli');
    expect(result).toContain('Commands:');
    expect(result).toContain('hps_cli help     Show help information');
    expect(result).toContain('hps_cli build    A build command');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );
    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });

  it('should display main CLI help when using --help flag', async () => {
    await cli.parse(['--help']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    const result = printer.mock.calls[0][0];
    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('CLI description');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli');
    expect(result).toContain('Commands:');
    expect(result).toContain('hps_cli help     Show help information');
    expect(result).toContain('hps_cli build    A build command');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );
    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });

  it('should display help information when using help command', async () => {
    await cli.parse(['help']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    const result = printer.mock.calls[0][0];
    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('Show help information');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );
    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });

  it('should display build command help with subcommands and flags when using -h or --help', async () => {
    await cli.parse(['build', '-h']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    let result = printer.mock.calls[0][0];
    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('A build command');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli build');
    expect(result).toContain('Examples:');
    expect(result).toContain('A build command example');
    expect(result).toContain('Subcommand:');
    expect(result).toContain('hps_cli build evolve    evolve description');
    expect(result).toContain('hps_cli build deploy    deploy description');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );

    expect(result).toContain('Flags:');
    expect(result).toContain(
      '-t, --build-type  [string]    build command type  (Default: build)'
    );

    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');

    await cli.parse(['build', '--help']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    result = printer.mock.calls[0][0];
    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('A build command');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli build');
    expect(result).toContain('Examples:');
    expect(result).toContain('A build command example');
    expect(result).toContain('Subcommand:');
    expect(result).toContain('hps_cli build evolve    evolve description');
    expect(result).toContain('hps_cli build deploy    deploy description');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );

    expect(result).toContain('Flags:');
    expect(result).toContain(
      '-t, --build-type  [string]    build command type  (Default: build)'
    );

    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });

  it('should display build command help with flags when using build-type flag and -h', async () => {
    await cli.parse(['build', '--build-type', 'prod', '-h']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    const result = printer.mock.calls[0][0];

    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('A build command');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli build');
    expect(result).toContain('Examples:');
    expect(result).toContain('A build command example');
    expect(result).toContain('Subcommand:');
    expect(result).toContain('hps_cli build evolve    evolve description');
    expect(result).toContain('hps_cli build deploy    deploy description');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );
    expect(result).toContain('Flags:');
    expect(result).toContain(
      '-t, --build-type  [string]    build command type  (Default: build)'
    );

    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });

  it('should display help command specific information when using help -h', async () => {
    await cli.parse(['help', '-h']);

    expect(printer).toHaveBeenCalled();
    expect(printer.mock.calls[0][0]).toBeDefined();
    const result = printer.mock.calls[0][0];

    expect(result).toContain('Name:     hps_cli');
    expect(result).toContain('Version:  1.0.0');
    expect(result).toContain('Description:');
    expect(result).toContain('Show help information');
    expect(result).toContain('Usage:');
    expect(result).toContain('$ hps_cli help');
    expect(result).toContain('Examples:');
    expect(result).toContain('cli --help or cli -h');
    expect(result).toContain('Global Flags:');

    expect(result).toContain(
      '-h, --help          [boolean]    Show help information                                      (Default: false)'
    );
    expect(result).toContain(
      '--no-color      [boolean]    Disable colored output in terminal                         (Default: false)'
    );
    expect(result).toContain(
      '--log-level     [value]      Set log level. options: error, warn, info, debug, verbose  (Default: Info)'
    );
    expect(result).toContain(
      '--hps-app-env   [string]     Process env key, default: APP_ENV                          (Default: APP_ENV)'
    );
    expect(result).toContain(
      '--hps-env-path  <string>     Process env file path'
    );
    expect(result).toContain('🎉🎉🎉Wizard cli is published by hps🎉🎉🎉');
    expect(result).toContain('@2025 wizard-plugin-help');
  });
});
