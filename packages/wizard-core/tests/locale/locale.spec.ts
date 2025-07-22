import { createWizard } from '../../src/create-wizard.js';
import { defineCommand, definePlugin } from '../../src/index.js';
import { sleep } from '../utils/test-utils.js';
import { messages } from './messages.js';

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
      errorHandler: (e) => {
        console.log(e);
      },
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

    cli.parse(['commandA']);
    await sleep();

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
      errorHandler: (e) => {
        console.log(e);
      },
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
    expect(commandBResult['name']).toBe('commandB');
    expect(commandBResult['description']).toBe('Plugin B description');
    expect(commandBResult['help']).toBe('Plugin B help');
    expect(commandBResult['example']).toBe('Plugin B example');

    const eventBResult = eventBHandler.mock.results[0].value;
    expect(eventBResult).toBeDefined();
    expect(eventBResult['name']).toBe('commandB');
    expect(eventBResult['description']).toBe('Plugin B description');
    expect(eventBResult['help']).toBe('Plugin B help');
    expect(eventBResult['example']).toBe('Plugin B example');

    commandBHandler.mockClear();
    eventBHandler.mockClear();

    cli.parse(['commandA']);
    await sleep();

    const commandAResult = commandAHandler.mock.results[0].value;

    expect(eventBHandler).not.toHaveBeenCalled();
    expect(commandBHandler).not.toHaveBeenCalled();

    expect(commandAResult).toBeDefined();

    expect(commandAResult['name']).toBe('commandA');
    expect(commandAResult['description']).toBe('Plugin A description');
    expect(commandAResult['help']).toBe('Plugin A help');
    expect(commandAResult['example']).toBe('Plugin A example');

    const eventAResult = eventAHandler.mock.results[0].value;
    expect(eventAResult).toBeDefined();
    expect(eventAResult['name']).toBe('commandA');
    expect(eventAResult['description']).toBe('Plugin A description');
    expect(eventAResult['help']).toBe('Plugin A help');
    expect(eventAResult['example']).toBe('Plugin A example');

    commandAHandler.mockClear();
    eventAHandler.mockClear();
  });
});
