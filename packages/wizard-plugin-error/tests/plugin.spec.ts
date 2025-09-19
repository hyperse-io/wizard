import {
  createWizard,
  defineCommand,
  type DefineMessageType,
  definePlugin,
} from '@hyperse/wizard';
import { createErrorPlugin } from '../src/create-error-plugin.js';
import { errorCliMessages } from './i18n/message.js';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof errorCliMessages> {}
}

const printer = vi.fn();
const originalPrinter = process.stdout.write;

describe('createErrorPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = printer;
  });

  afterEach(() => {
    process.stdout.write = originalPrinter;
  });

  it('should create a plugin that logs errors to the console', async () => {
    const cli = createWizard({
      name: 'hps_cli',
      description: 'cli.errorCli.description',
      version: 'cli.errorCli.version',
      localeMessages: errorCliMessages,
      noColor: true,
    });

    const plugin = createErrorPlugin({ exitProcess: false });

    cli
      .use(plugin)
      .use(
        definePlugin({
          name: () => 'test plugin',
          setup: (cli) => {
            return cli.register('test ', {
              description: () => 'test',
            });
          },
        })
      )
      .on('test ', (data) => {
        console.log(data);
      });

    await cli.parse(['test']);

    expect(printer).toHaveBeenCalled();

    const result = printer.mock.calls[0][0];
    expect(result).toContain('[ ERROR ]');
    expect(result).toContain(
      'Invalid command name "test " command names cannot contain spaces or multiple consecutive spaces.'
    );
  });

  it('should create a plugin that logs errors to the console with custom logger', async () => {
    const cli = createWizard({
      name: 'hps_cli',
      description: 'cli.errorCli.description',
      version: 'cli.errorCli.version',
      localeMessages: errorCliMessages,
      noColor: true,
    });

    const plugin = createErrorPlugin({
      exitProcess: false,
    });

    cli
      .use(plugin)
      .use(
        definePlugin({
          name: () => 'test plugin',
          setup: (cli) => {
            return cli.register('test', {
              description: () => 'test',
            });
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'build plugin',
          setup: (cli) => {
            return cli.register(
              defineCommand('build', {
                description: () => 'build',
              }).use(
                defineCommand('evolve', {
                  description: () => 'evolve',
                }).use(
                  defineCommand('mini', {
                    description: () => 'mini',
                  })
                )
              )
            );
          },
        })
      );

    await cli.parse(['testA']);
    expect(printer).toHaveBeenCalled();
    const result = printer.mock.calls[0][0];
    expect(result).toContain('[ ERROR ]');
    expect(result).toContain('Command "testA" not found. Did you mean "test"?');

    printer.mockClear();
    await cli.parse(['build', 'evolve', 'mini2']);
    expect(printer).toHaveBeenCalled();
    const result1 = printer.mock.calls[0][0];
    expect(result1).toContain('[ ERROR ]');
    expect(result1).toContain(
      'Command "build evolve mini2" not found. Did you mean "build evolve mini"?'
    );
  });
});
