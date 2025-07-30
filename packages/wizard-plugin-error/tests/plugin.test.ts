import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createWizard,
  type DefineMessageType,
  definePlugin,
} from '@hyperse/wizard-core';
import { createErrorPlugin } from '../src/create-error-plugin.js';
import { errorCliMessages } from './i18n/message.js';
import { sleep } from './utils/test-utils.js';

declare module '@hyperse/wizard-core' {
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
    });

    const plugin = createErrorPlugin();

    cli.use(plugin).use(
      definePlugin({
        setup: (cli) => {
          return cli.register('test ', {
            description: () => 'test',
          });
        },
      })
    );

    cli.parse(['test']);

    await sleep();

    expect(printer).toHaveBeenCalled();

    const result = printer.mock.calls[0][0];
    expect(result).toContain('[ ERROR ]');
    expect(result).toContain('error');
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
    });

    const plugin = createErrorPlugin({
      capitalizeLevelName: true,
      showPrefix: false,
      showLoggerName: true,
      showPluginName: true,
      showTimestamp: true,
      showLevelName: true,
      use24HourClock: true,
      showArrow: true,
      showDate: true,
    });

    cli.use(plugin).use(
      definePlugin({
        setup: (cli) => {
          return cli.register('test ', {
            description: () => 'test',
          });
        },
      })
    );

    cli.parse(['test']);

    await sleep();

    expect(printer).toHaveBeenCalled();
    const result = printer.mock.calls[0][0];
    expect(result).toContain('[ ERROR ]');
    expect(result).toContain(' HpsErrorLogger ');
    expect(result).toContain(' hps-logger-plugin-stdout ');
    expect(result).toContain(' >> ');
    expect(result).toContain('error');
    expect(result).toContain(
      'Invalid command name "test " command names cannot contain spaces or multiple consecutive spaces.'
    );
  });
});
