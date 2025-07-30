import { createWizard } from '../src/create-wizard.js';
import { defineCommand } from '../src/define-command.js';
import { definePlugin } from '../src/index.js';
import { sleep } from './utils/test-utils.js';

describe('cli', () => {
  const miniHandler = vi.fn();
  const evolveHandler = vi.fn();
  const buildHandler = vi.fn();
  const deployHandler = vi.fn();
  const buildEvolveMiniEvent = vi.fn();
  const buildEvent = vi.fn();
  const buildEvolveEvent = vi.fn();
  const errorEvent = vi.fn((e) => {
    console.log(e);
  });

  beforeEach(() => {});

  afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  const miniCmd = defineCommand<'mini', { miniConfig: { miniKey: string } }>(
    'mini',
    {
      description: () => 'mini description',
    }
  )
    .flags({
      version: {
        type: String,
        alias: 'v',
        description: () => 'version with 1.0.0 or 2.0.0',
        default: '1.0.0',
      },
    })
    .handler((ctx) => miniHandler(ctx));

  const evolveCmd = defineCommand<'evolve', { root1: { root11: string } }>(
    'evolve',
    {
      description: () => 'evolve description',
    }
  )
    .flags({
      compiler: {
        type: String,
        alias: 'c',
        description: () => 'compiler with rspack or vite',
        default: 'rspack',
      },
      env: {
        type: String,
        alias: 'e',
        description: () => 'env with dev or prod',
        default: 'dev',
      },
    })
    .use(miniCmd)
    .resolver(async () => {
      return Promise.resolve({ miniConfig: { miniKey: 'mini' } });
    })
    .handler((ctx) => {
      evolveHandler(ctx);
    });

  const buildCmd = defineCommand<'build', { root: { root1: string } }>(
    'build',
    {
      description: () => 'build description',
    }
  )
    .flags({
      projectCwd: {
        alias: 'p',
        type: String,
        description: () => 'project cwd',
        default: 'user/project/foo',
      },
    })
    .use(evolveCmd)
    .resolver({ root1: { root11: 'root11' } })
    .handler((ctx) => buildHandler(ctx));

  const deployCmd = defineCommand<'deploy', { root1: { root11: string } }>(
    'deploy',
    {
      description: () => 'deploy description',
    }
  )
    .flags({
      fileType: {
        type: String,
        alias: 'f',
        description: () => 'file type with js or ts',
        default: 'js',
      },
      ossType: {
        type: String,
        alias: 'o',
        description: () => 'oss type with aliyun or tencent',
        default: 'aliyun',
      },
    })
    .handler((ctx) => {
      deployHandler(ctx);
    });

  it('test command build', async () => {
    const cli = createWizard({
      name: 'wWizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      errorHandler: errorEvent,
    })
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(buildCmd),
        })
      )
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(deployCmd),
        })
      )
      .on('build', buildEvent)
      .on('build.evolve', buildEvolveEvent)
      .on('build.evolve.mini', buildEvolveMiniEvent)
      .on('error', errorEvent);

    // cmd: build
    cli.parse(['build']);
    await sleep();
    expect(miniHandler).not.toHaveBeenCalled();
    expect(evolveHandler).not.toHaveBeenCalled();
    expect(buildHandler).toHaveBeenCalled();
    expect(buildHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: undefined,
      flags: { projectCwd: 'user/project/foo' },
      name: 'build',
    });
    const description = buildHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('build description');
  });

  it('test command build evolve', async () => {
    const cli = createWizard({
      name: 'wWizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      errorHandler: errorEvent,
    })
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(buildCmd),
        })
      )
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(deployCmd),
        })
      )
      .on('build', buildEvent)
      .on('build.evolve', buildEvolveEvent)
      .on('build.evolve.mini', buildEvolveMiniEvent)
      .on('error', errorEvent);

    // cmd: build evolve mini
    cli.parse(['build', 'evolve']);
    await sleep();
    expect(buildHandler).not.toHaveBeenCalled();
    expect(miniHandler).not.toHaveBeenCalled();
    expect(evolveHandler).toHaveBeenCalled();
    expect(evolveHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: { root1: { root11: 'root11' } },
      flags: { compiler: 'rspack', env: 'dev' },
      name: 'evolve',
    });
    const description = evolveHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('evolve description');
  });

  it('test command build evolve mini', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      errorHandler: errorEvent,
    })
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(buildCmd),
        })
      )
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(deployCmd),
        })
      )
      .on('build', (ctx) => {
        ctx.i18n.t('core.command.notConfiguration');
      })
      .on('build.evolve', buildEvolveEvent)
      .on('build.evolve.mini', buildEvolveMiniEvent)
      .on('error', errorEvent);

    // cmd: build evolve mini
    cli.parse(['build', 'evolve', 'mini']);
    await sleep();
    expect(buildHandler).not.toHaveBeenCalled();
    expect(evolveHandler).not.toHaveBeenCalled();
    expect(miniHandler).toHaveBeenCalled();
    expect(miniHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: { miniConfig: { miniKey: 'mini' } },
      flags: { version: '1.0.0' },
      name: 'mini',
    });
    const description = miniHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('mini description');
  });

  it('test command deploy', async () => {
    const cli = createWizard({
      name: 'wWizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      errorHandler: errorEvent,
    })
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(buildCmd),
        })
      )
      .use(
        definePlugin({
          setup: (wizard) => wizard.register(deployCmd),
        })
      )
      .on('build', buildEvent)
      .on('build.evolve', buildEvolveEvent)
      .on('build.evolve.mini', buildEvolveMiniEvent)
      .on('error', errorEvent);

    // cmd: build evolve mini
    cli.parse([
      'deploy',
      '-h',
      '--compiler=vite',
      '--fileType=js',
      '--ossType=azure',
    ]);
    await sleep();
    expect(buildHandler).not.toHaveBeenCalled();
    expect(evolveHandler).not.toHaveBeenCalled();
    expect(miniHandler).not.toHaveBeenCalled();
    expect(deployHandler).toHaveBeenCalled();
    expect(deployHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: undefined,
      flags: { fileType: 'js', ossType: 'azure' },
      name: 'deploy',
    });
    const description = deployHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('deploy description');
  });

  it('test command customPlugin', async () => {
    const customPluginEvent = vi.fn();
    const customPluginHandler = vi.fn();
    const cli = createWizard({
      name: 'wWizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      errorHandler: errorEvent,
    })
      .use(
        definePlugin({
          setup: (wizard) =>
            wizard.register('customPlugin', {
              description: () => 'customPlugin description',
              handler: (ctx) => {
                customPluginHandler(ctx);
              },
            }),
        })
      )
      .on('customPlugin', customPluginEvent);

    // cmd: customPlugin
    cli.parse(['customPlugin']);
    await sleep();
    expect(customPluginHandler).toHaveBeenCalled();
    const description = customPluginHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('customPlugin description');
  });
});
