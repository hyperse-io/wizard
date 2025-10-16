import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { LogLevel } from '@hyperse/logger';
import { createWizard } from '../../src/create-wizard.js';
import { defineCommand } from '../../src/define-command.js';
import { definePlugin } from '../../src/index.js';
import wizardConfig from './fixtures/wizard.config.js';
import wizardAsyncConfig from './fixtures/wizard-async.config.js';

describe('builtin flags', () => {
  const buildHandler = vi.fn();
  const evolveHandler = vi.fn();
  const mockHandler = vi.fn();
  const originalPrinter = process.stdout.write;

  afterEach(() => {
    process.stdout.write = originalPrinter;
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  const buildCmd = defineCommand<'build', { root: { root1: string } }>(
    'build',
    {
      description: () => 'build description',
    }
  )
    .use(
      defineCommand<'evolve', object>('evolve', {
        description: () => 'evolve description',
      })
        .loadConfig('wizard')
        .process((ctx) => {
          evolveHandler(ctx);
        })
    )
    .process((ctx) => {
      buildHandler(ctx);
    });

  const mockCmd = defineCommand<'mock', { root: { root1: string } }>('mock', {
    description: () => 'mock description',
  })
    .loadConfig('wizard')
    .process((ctx) => {
      mockHandler(ctx);
    });

  const buildAsyncCmd = defineCommand<'build', { root: { root1: string } }>(
    'build',
    {
      description: () => 'build description',
    }
  )
    .use(
      defineCommand<'evolve', object>('evolve', {
        description: () => 'evolve description',
      })
        .loadConfig('wizard-async')
        .process((ctx) => {
          evolveHandler(ctx);
        })
    )
    .process((ctx) => {
      buildHandler(ctx);
    });

  const mockAsyncCmd = defineCommand<'mock', { root: { root1: string } }>(
    'mock',
    {
      description: () => 'mock description',
    }
  )
    .loadConfig('wizard-async')
    .process((ctx) => {
      mockHandler(ctx);
    });

  const projectCwd = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

  it('test load config: object config', async () => {
    const cli = createWizard({
      name: 'Wizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      locale: 'en',
      logLevel: LogLevel.Info,
      errorHandler: (err) => {
        console.log(err);
      },
    })
      .use(
        definePlugin({
          name: () => 'mockPlugin',
          setup: (wizard) => {
            wizard.setupContextLoader((_flags, _configFile) => {
              return wizardConfig();
            });
            return wizard;
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'mockPlugin',
          setup: (wizard) => {
            return wizard.register(mockCmd);
          },
        })
      );
    // cmd: mock
    await cli.parse(['mock', '--projectCwd', projectCwd]);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: {
        hostname: 'dev.wizard.com',
        mockBaseDir: `./mocks`,
        port: 40000,
        chunkSize: 3,
        staticMap: {
          '/static': 'static',
        },
      },
      name: 'mock',
    });
  });

  it('test load config: function', async () => {
    const cli = createWizard({
      name: 'Wizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      locale: 'en',
      logLevel: LogLevel.Info,
      errorHandler: (err) => {
        console.log(err);
      },
    })
      .use(
        definePlugin({
          name: () => 'mockPlugin',
          setup: (wizard) => {
            wizard.setupContextLoader((_flags, _configFile) => {
              return wizardConfig();
            });
            return wizard;
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'buildPlugin',
          setup: (wizard) => {
            return wizard.register(buildCmd);
          },
        })
      );
    // cmd: build evolve
    await cli.parse(['build', 'evolve', '--projectCwd', projectCwd]);
    expect(evolveHandler).toHaveBeenCalled();
    expect(evolveHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: {
        entryMap: {
          home: {
            entry: ['./src/home/index.tsx'],
            options: {},
          },
          mine: {
            entry: ['./src/mine/index.tsx'],
            options: {},
          },
        },
      },
      name: 'evolve',
    });
  });

  it('test load config: async function', async () => {
    const cli = createWizard({
      name: 'Wizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      locale: 'en',
      logLevel: LogLevel.Info,
      errorHandler: (err) => {
        console.log(err);
      },
    })
      .use(
        definePlugin({
          name: () => 'mockPlugin',
          setup: (wizard) => {
            wizard.setupContextLoader((_flags, _configFile) => {
              return wizardAsyncConfig();
            });
            return wizard;
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'buildPlugin',
          setup: (wizard) => {
            return wizard.register(buildAsyncCmd);
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'mockPlugin',
          setup: (wizard) => {
            return wizard.register(mockAsyncCmd);
          },
        })
      );
    // cmd: build evolve
    await cli.parse(['build', 'evolve', '--projectCwd', projectCwd]);
    expect(evolveHandler).toHaveBeenCalled();
    expect(evolveHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: {
        entryMap: {
          home: {
            entry: ['./src/home/index.tsx'],
            options: {},
          },
          mine: {
            entry: ['./src/mine/index.tsx'],
            options: {},
          },
        },
      },
      name: 'evolve',
    });

    // cmd: mock
    await cli.parse(['mock', '--projectCwd', projectCwd]);
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: {
        hostname: 'dev.wizard.com',
        mockBaseDir: `./mocks`,
        port: 40000,
        chunkSize: 3,
        staticMap: {
          '/static': 'static',
        },
      },
      name: 'mock',
    });
  });
});
