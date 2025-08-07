import { createWizard } from '../../src/create-wizard.js';
import { defineCommand, definePlugin } from '../../src/index.js';
import { cliMessages, messages } from './messages.js';

describe('useLocale', () => {
  const commandAHandler = vi.fn((ctx) => {
    return ctx;
  });

  const commandBHandler = vi.fn((ctx) => {
    return ctx;
  });

  const eventAHandler = vi.fn((ctx) => {
    return ctx;
  });

  const eventBHandler = vi.fn((ctx) => {
    return ctx;
  });

  it('should return the correct locale (Chinese locale)', async () => {
    process.env.HPS_WIZARD_LOCALE = 'zh';
    const commandA = defineCommand<'commandA', { projectCwd: string }>(
      'commandA',
      {
        description: 'plugins.pluginA.description',
        help: 'plugins.pluginA.help',
        example: 'plugins.pluginA.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: () => 'cwd',
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandAHandler(ctx);
      });

    const commandB = defineCommand<'commandB', { projectCwd: string }>(
      'commandB',
      {
        description: 'plugins.pluginB.description',
        help: 'plugins.pluginB.help',
        example: (t) => {
          return t('plugins.pluginB.example');
        },
      }
    )
      .flags({
        cwd: {
          type: String,
          description: () => 'cwd',
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandBHandler(ctx);
      });

    const cli = createWizard({
      name: 'cli',
      description: 'cli.description',
      version: (t) => t('cli.version', { version: '1.0.0' }),
      localeMessages: cliMessages,
      errorHandler: (e) => {
        console.log(e);
      },
    })
      .use(
        definePlugin({
          name: () => 'pluginA',
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
    await cli.parse(['commandA', 'commandB']);

    expect(cli.name).toBe('cli');
    expect(cli.description).toBe('Wizard 的命令行工具。');
    expect(cli.version).toBe('1.0.0');

    const commandBResult = commandBHandler.mock.results[0].value;
    expect(commandBResult).toBeDefined();
    expect(commandBResult['name']).toBe('commandB');
    expect(commandBResult['description']).toBe('插件 B 描述');
    expect(commandBResult['help']).toBe('插件 B 帮助');
    expect(commandBResult['example']).toBe('插件 B 示例');

    const eventBResult = eventBHandler.mock.results[0].value;
    expect(eventBResult).toBeDefined();
    expect(eventBResult['name']).toBe('commandB');
    expect(eventBResult['description']).toBe('插件 B 描述');
    expect(eventBResult['help']).toBe('插件 B 帮助');
    expect(eventBResult['example']).toBe('插件 B 示例');

    commandBHandler.mockClear();
    eventBHandler.mockClear();

    await cli.parse(['commandA']);

    const commandAResult = commandAHandler.mock.results[0].value;

    expect(eventBHandler).not.toHaveBeenCalled();
    expect(commandBHandler).not.toHaveBeenCalled();

    expect(commandAResult).toBeDefined();

    expect(commandAResult['name']).toBe('commandA');
    expect(commandAResult['description']).toBe('插件 A 描述');
    expect(commandAResult['help']).toBe('插件 A 帮助');
    expect(commandAResult['example']).toBe('插件 A 示例');

    const eventAResult = eventAHandler.mock.results[0].value;
    expect(eventAResult).toBeDefined();
    expect(eventAResult['name']).toBe('commandA');
    expect(eventAResult['description']).toBe('插件 A 描述');
    expect(eventAResult['help']).toBe('插件 A 帮助');
    expect(eventAResult['example']).toBe('插件 A 示例');

    commandAHandler.mockClear();
    eventAHandler.mockClear();
  });

  it('should return the correct locale (English locale)', async () => {
    process.env.HPS_WIZARD_LOCALE = 'en';
    const commandA = defineCommand<'commandA', { projectCwd: string }>(
      'commandA',
      {
        description: (t, extraOptions) => {
          return (
            t('plugins.pluginA.description') +
            ' - ' +
            extraOptions?.commands.join(' ')
          );
        },
        help: 'plugins.pluginA.help',
        example: 'plugins.pluginA.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: (t) => {
            return t('plugins.pluginA.description');
          },
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandAHandler(ctx);
      });

    const commandB = defineCommand<'commandB', { projectCwd: string }>(
      'commandB',
      {
        description: (t, extraOptions) => {
          return (
            t('plugins.pluginB.description') +
            ' - ' +
            extraOptions?.commands.join(' ')
          );
        },
        help: 'plugins.pluginB.help',
        example: 'plugins.pluginB.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: () => 'cwd',
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandBHandler(ctx);
      });

    const cli = createWizard({
      name: 'cli',
      description: 'cli.description',
      version: () => '1.0.0',
      localeMessages: cliMessages,
      errorHandler: (e) => {
        console.log(e);
      },
    })
      .use(
        definePlugin({
          name: () => 'pluginA',
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
    await cli.parse(['commandA', 'commandB']);

    expect(cli.name).toBe('cli');
    expect(cli.description).toBe('A CLI for Wizard.');
    expect(cli.version).toBe('1.0.0');

    const commandBResult = commandBHandler.mock.results[0].value;
    expect(commandBResult).toBeDefined();
    expect(commandBResult['name']).toBe('commandB');
    expect(commandBResult['description']).toBe(
      'Plugin B description - commandA commandB'
    );
    expect(commandBResult['help']).toBe('Plugin B help');
    expect(commandBResult['example']).toBe('Plugin B example');

    const eventBResult = eventBHandler.mock.results[0].value;
    expect(eventBResult).toBeDefined();
    expect(eventBResult['name']).toBe('commandB');
    expect(eventBResult['description']).toBe(
      'Plugin B description - commandA commandB'
    );
    expect(eventBResult['help']).toBe('Plugin B help');
    expect(eventBResult['example']).toBe('Plugin B example');

    commandBHandler.mockClear();
    eventBHandler.mockClear();

    await cli.parse(['commandA']);

    const commandAResult = commandAHandler.mock.results[0].value;

    expect(eventBHandler).not.toHaveBeenCalled();
    expect(commandBHandler).not.toHaveBeenCalled();

    expect(commandAResult).toBeDefined();

    expect(commandAResult['name']).toBe('commandA');
    expect(commandAResult['description']).toBe(
      'Plugin A description - commandA'
    );
    expect(commandAResult['help']).toBe('Plugin A help');
    expect(commandAResult['example']).toBe('Plugin A example');

    const eventAResult = eventAHandler.mock.results[0].value;
    expect(eventAResult).toBeDefined();
    expect(eventAResult['name']).toBe('commandA');
    expect(eventAResult['description']).toBe('Plugin A description - commandA');
    expect(eventAResult['help']).toBe('Plugin A help');
    expect(eventAResult['example']).toBe('Plugin A example');

    commandAHandler.mockClear();
    eventAHandler.mockClear();
  });

  it('should return the correct locale (English locale)1', async () => {
    process.env.HPS_WIZARD_LOCALE = 'en';
    const commandA = defineCommand<'commandA', { projectCwd: string }>(
      'commandA',
      {
        description: (t, extraOptions) => {
          return (
            t('plugins.pluginA.description') +
            ' - ' +
            extraOptions?.commands.join(' ')
          );
        },
        help: 'plugins.pluginA.help',
        example: 'plugins.pluginA.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: (t) => {
            return t('plugins.pluginA.description');
          },
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandAHandler(ctx);
      });

    const commandB = defineCommand<'commandB', { projectCwd: string }>(
      'commandB',
      {
        description: (t, extraOptions) => {
          return (
            t('plugins.pluginB.description') +
            ' - ' +
            extraOptions?.commands.join(' ')
          );
        },
        help: 'plugins.pluginB.help',
        example: 'plugins.pluginB.example',
      }
    )
      .flags({
        cwd: {
          type: String,
          description: () => 'cwd',
          default: 'user/project/foo',
        },
      })
      .process((ctx) => {
        commandBHandler(ctx);
      });

    const cli = createWizard({
      name: 'cli',
      description: 'cli.description',
      version: () => '1.0.0',
      errorHandler: (e) => {
        console.log(e);
      },
    })
      .use(
        definePlugin({
          name: () => 'pluginA',
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
    await cli.parse(['commandA', 'commandB']);

    expect(cli.name).toBe('cli');
    expect(cli.description).toBe('en.cli.description');
    expect(cli.version).toBe('1.0.0');

    const commandBResult = commandBHandler.mock.results[0].value;
    expect(commandBResult).toBeDefined();
    expect(commandBResult['name']).toBe('commandB');
    expect(commandBResult['description']).toBe(
      'en.plugins.pluginB.description - commandA commandB'
    );
    expect(commandBResult['help']).toBe('en.plugins.pluginB.help');
    expect(commandBResult['example']).toBe('en.plugins.pluginB.example');

    const eventBResult = eventBHandler.mock.results[0].value;
    expect(eventBResult).toBeDefined();
    expect(eventBResult['name']).toBe('commandB');
    expect(eventBResult['description']).toBe(
      'en.plugins.pluginB.description - commandA commandB'
    );
    expect(eventBResult['help']).toBe('en.plugins.pluginB.help');
    expect(eventBResult['example']).toBe('en.plugins.pluginB.example');

    commandBHandler.mockClear();
    eventBHandler.mockClear();
  });
});
