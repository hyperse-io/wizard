import {
  createWizard,
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

    cli.use(plugin).use(
      definePlugin({
        name: () => 'test plugin',
        setup: (cli) => {
          return cli.register('test ', {
            description: () => 'test',
          });
        },
      })
    );

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

    cli.use(plugin).use(
      definePlugin({
        name: () => 'test plugin',
        setup: (cli) => {
          return cli.register('test', {
            description: () => 'test',
          });
        },
      })
    );

    await cli.parse(['testA']);

    expect(printer).toHaveBeenCalled();
    const result = printer.mock.calls[0][0];
    console.log(result);
    expect(result).toContain('[ ERROR ]');
    expect(result).toContain('Command "testA" not found. Did you mean "test"?');
  });
});
