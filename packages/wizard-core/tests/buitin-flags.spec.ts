import { LogLevel } from '@hyperse/logger';
import { createWizard } from '../src/create-wizard.js';
import { defineCommand } from '../src/define-command.js';
import { definePlugin } from '../src/index.js';
import { sleep } from './utils/test-utils.js';

describe('builtin flags', () => {
  const buildHandler = vi.fn();
  const globalInterceptorHandler = vi.fn();
  const helpInterceptorHandler = vi.fn();
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
    .flags({
      projectCwd: {
        alias: 'p',
        type: String,
        description: () => 'project cwd',
        default: 'user/project/foo',
      },
    })
    .handler((ctx) => {
      buildHandler(ctx);
    });

  it('test command build with builtin flags', async () => {
    const cli = createWizard({
      name: 'wWizard',
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
          name: () => 'buildPlugin',
          setup: (wizard) => {
            return wizard.register(buildCmd);
          },
        })
      )
      .use(
        definePlugin({
          name: () => 'buildPlugin',
          setup: (wizard) => {
            const cli = wizard.flag('help', {
              type: Boolean,
              alias: 'h',
              description: () => 'help',
              default: false,
            });

            cli.interceptor((ctx, next) => {
              //flags typing level、noColor、help
              helpInterceptorHandler(ctx);
              next();
            });
            return cli;
          },
        })
      )
      .interceptor(async (ctx, next) => {
        //flags typing level、noColor
        globalInterceptorHandler(ctx);
        await next();
      });
    // cmd: build
    cli.parse(['build', '--logLevel', 'debug', '--noColor']);
    await sleep();
    expect(buildHandler).toHaveBeenCalled();
    expect(buildHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      ctx: undefined,
      flags: {
        projectCwd: 'user/project/foo',
        logLevel: LogLevel.Debug,
        noColor: true,
      },
      name: 'build',
    });
    const description = buildHandler.mock.lastCall?.[0]?.description;
    expect(description).toBeDefined();
    expect(description).toBe('build description');

    //help interceptor
    expect(helpInterceptorHandler).toHaveBeenCalled();
    expect(helpInterceptorHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      flags: {
        logLevel: LogLevel.Debug,
        noColor: true,
        help: false,
      },
    });

    //global interceptor
    expect(globalInterceptorHandler).toHaveBeenCalled();
    expect(globalInterceptorHandler.mock.lastCall?.[0]).toMatchObject({
      locale: 'en',
      flags: {
        logLevel: LogLevel.Debug,
        noColor: true,
      },
    });
  });

  it('test command build with builtin flags2', async () => {
    const cli = createWizard({
      name: 'wWizard',
      description: () => 'wWizard description',
      version: () => '1.0.0',
      locale: 'en',
      logLevel: LogLevel.Info,
    }).use(
      definePlugin({
        name: () => 'buildPlugin',
        setup: (wizard) => {
          const cli = wizard
            .flag('help', {
              type: Boolean,
              alias: 'h',
              description: () => 'help',
              default: false,
            })
            .interceptor((ctx, next) => {
              //flags typing level、noColor、help
              if (ctx.flags.help) {
                ctx.logger.error('help error log');
                ctx.logger.warn('help warn log');
                ctx.logger.info('help info log');
                ctx.logger.debug('help debug log');
                ctx.logger.verbose('help verbose log');
                helpInterceptorHandler(ctx);
              }
              next();
            });
          return cli;
        },
      })
    );

    const printer = vi.fn();
    process.stdout.write = printer;

    //logLevel: verbose
    cli.parse(['-h', '--logLevel', 'verbose']);
    printer.mockReset();
    await sleep();
    let logResult = printer.mock.calls.map((call) => call[0]).join('');
    expect(logResult).toContain('help error log');
    expect(logResult).toContain('help warn log');
    expect(logResult).toContain('help info log');
    expect(logResult).toContain('help debug log');
    expect(logResult).toContain('help verbose log');

    //logLevel: debug
    printer.mockReset();
    cli.parse(['-h', '--logLevel', 'debug']);
    await sleep();
    logResult = printer.mock.calls.map((call) => call[0]).join('');
    expect(logResult).toContain('help error log');
    expect(logResult).toContain('help warn log');
    expect(logResult).toContain('help info log');
    expect(logResult).toContain('help debug log');
    expect(logResult).not.toContain('help verbose log');

    // logLevel: info
    printer.mockReset();
    cli.parse(['-h', '--logLevel', 'info']);
    await sleep();
    expect(printer).toHaveBeenCalled();
    logResult = printer.mock.calls.map((call) => call[0]).join('');
    expect(logResult).toContain('help error log');
    expect(logResult).toContain('help warn log');
    expect(logResult).toContain('help info log');
    expect(logResult).not.toContain('help debug log');
    expect(logResult).not.toContain('help verbose log');

    //logLevel: warn
    printer.mockReset();
    cli.parse(['-h', '--logLevel', 'warn']);
    await sleep();
    logResult = printer.mock.calls.map((call) => call[0]).join('');
    expect(logResult).toContain('help error log');
    expect(logResult).toContain('help warn log');
    expect(logResult).not.toContain('help info log');
    expect(logResult).not.toContain('help debug log');
    expect(logResult).not.toContain('help verbose log');

    //logLevel: error
    printer.mockReset();
    cli.parse(['-h', '--logLevel', 'error']);
    await sleep();
    logResult = printer.mock.calls.map((call) => call[0]).join('');
    expect(logResult).toContain('help error log');
    expect(logResult).not.toContain('help warn log');
    expect(logResult).not.toContain('help info log');
    expect(logResult).not.toContain('help debug log');
    expect(logResult).not.toContain('help verbose log');
  });
});
