import { createWizard } from '../../src/core/createWizard.js';
import { defineCommand, definePlugin } from '../../src/index.js';
import { sleep } from '../utils/test-utils.js';
import { messages } from './messages.js';

describe('useLocale', () => {
  const commandAHandler = vi.fn((ctx) => {
    const { t } = ctx.i18n;
    return t;
  });

  const commandBHandler = vi.fn((ctx) => {
    const { t } = ctx.i18n;
    return t;
  });

  const eventAHandler = vi.fn((ctx) => {
    const { t } = ctx.i18n;
    return t;
  });

  const eventBHandler = vi.fn((ctx) => {
    const { t } = ctx.i18n;
    return t;
  });

  it('should return the correct locale', async () => {
    const commandA = defineCommand<'commandA', { projectCwd: string }>(
      'commandA',
      {
        description: 'pluginA.description',
        help: 'pluginA.help',
        example: 'pluginA.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: 'cwd',
          default: 'user/project/foo',
        },
      })
      .handler((ctx) => {
        commandAHandler(ctx);
      });

    const commandB = defineCommand<'commandB', { projectCwd: string }>(
      'commandB',
      {
        description: 'pluginB.description',
        help: 'pluginB.help',
        example: 'pluginB.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: 'cwd',
          default: 'user/project/foo',
        },
      })
      .handler((ctx) => {
        commandBHandler(ctx);
      });

    const cli = createWizard({
      name: 'core.cli.name',
      description: 'core.cli.description',
      version: () => '1.0.0',
      errorHandler: () => {},
    })
      .use(
        definePlugin({
          localeMessages: messages,
          setup: (wizard) => {
            return wizard.register(commandA.use(commandB));
          },
        })
      )
      .on('commandA', (ctx) => {
        eventAHandler(ctx);
      })
      .on('commandA.commandB', (ctx) => {
        eventBHandler(ctx);
      });

    // cmd: commandA
    cli.parse(['commandA', 'commandB']);
    await sleep();

    const commandBResult = commandBHandler.mock.results[0].value;
    expect(commandBResult).toBeDefined();
    expect(commandBResult('pluginB.name')).toBe('Plugin B');
    expect(commandBResult('pluginB.description')).toBe('Plugin B description');
    expect(commandBResult('pluginB.help')).toBe('Plugin B help');
    expect(commandBResult('pluginB.version')).toBe('Plugin B version');
    expect(commandBResult('pluginB.example')).toBe('Plugin B example');
    expect(commandBResult('pluginB.command.notFound')).toBe(
      '【Plugin B】Command cmdName not found.'
    );

    const eventBResult = eventBHandler.mock.results[0].value;
    expect(eventBResult).toBeDefined();
    expect(eventBResult('pluginB.name')).toBe('Plugin B');
    expect(eventBResult('pluginB.description')).toBe('Plugin B description');
    expect(eventBResult('pluginB.help')).toBe('Plugin B help');
    expect(eventBResult('pluginB.version')).toBe('Plugin B version');
    expect(eventBResult('pluginB.example')).toBe('Plugin B example');

    commandBHandler.mockClear();
    eventBHandler.mockClear();

    cli.parse(['commandA']);
    await sleep();

    const commandAResult = commandAHandler.mock.results[0].value;

    expect(eventBHandler).not.toHaveBeenCalled();
    expect(commandBHandler).not.toHaveBeenCalled();

    expect(commandAResult).toBeDefined();

    expect(commandAResult('pluginA.name')).toBe('Plugin A');
    expect(commandAResult('pluginA.description')).toBe('Plugin A description');
    expect(commandAResult('pluginA.help')).toBe('Plugin A help');
    expect(commandAResult('pluginA.version')).toBe('Plugin A version');
    expect(commandAResult('pluginA.example')).toBe('Plugin A example');
    expect(commandAResult('pluginA.command.notFound')).toBe(
      '【Plugin A】Command cmdName not found.'
    );

    const eventAResult = eventAHandler.mock.results[0].value;
    expect(eventAResult).toBeDefined();
    expect(eventAResult('pluginA.name')).toBe('Plugin A');
    expect(eventAResult('pluginA.description')).toBe('Plugin A description');
    expect(eventAResult('pluginA.help')).toBe('Plugin A help');
    expect(eventAResult('pluginA.version')).toBe('Plugin A version');
    expect(eventAResult('pluginA.example')).toBe('Plugin A example');

    commandAHandler.mockClear();
    eventAHandler.mockClear();
  });
});
