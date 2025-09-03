import fs from 'node:fs';
import { LogLevel } from '@hyperse/logger';
import { createWizard } from '../src/create-wizard.js';
import { defineCommand } from '../src/define-command.js';
import { definePlugin } from '../src/index.js';

function writeEnvFile(name: string, text: string) {
  const path = fs.realpathSync(process.cwd());
  fs.writeFileSync(`${path}/${name}`, text);
}

describe('Environment variable loading in Wizard CLI', () => {
  const buildHandler = vi.fn();
  const helpInterceptorHandler = vi.fn();
  const originalPrinter = process.stdout.write;

  afterEach(() => {
    process.stdout.write = originalPrinter;
    vi.resetAllMocks();
    vi.clearAllMocks();
    const files = ['.env', '.env.stage1', '.env.stage2', '.env.stage3'];
    for (const file of files) {
      if (fs.existsSync(file)) {
        fs.rmSync(file);
      }
    }
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
        type: () => 1,
        description: () => 'project cwd',
        default: 'user/project/foo',
      },
    })
    .process((ctx) => {
      buildHandler(ctx);
    });

  it('should load environment variables from the default .env file', async () => {
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
      );
    writeEnvFile('.env', 'NEXT_PUBLIC_FOO=dev');
    await cli.parse(['build']);
    expect(process.env.NEXT_PUBLIC_FOO).toBe('dev');

    writeEnvFile('.env.stage1', 'NEXT_PUBLIC_FOO1=stage1');
    await cli.parse(['build', '--hpsEnvPath', '.env.stage1']);
    expect(process.env.NEXT_PUBLIC_FOO1).toBe('stage1');

    writeEnvFile('.env.stage2', 'NEXT_PUBLIC_FOO2=stage2');
    process.env.APP_ENV = 'stage2';
    await cli.parse(['build', '--hpsAppEnv', 'APP_ENV']);
    expect(process.env.NEXT_PUBLIC_FOO2).toBe('stage2');
  });

  it('should load environment variables from a custom env file based on the specified app environment variable', async () => {
    const cli = createWizard({
      name: 'wWizard',
      description: () =>
        'A wizard CLI for testing environment variable loading via custom app env',
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
            expect(process.env.NEXT_PUBLIC_FOO3).toBe('stage3');
            const cli = wizard.flag('help', {
              type: Boolean,
              alias: 'h',
              description: () => 'Display help information',
              default: false,
            });

            cli.interceptor((ctx, next) => {
              // Intercepts help flag and handles help output
              helpInterceptorHandler(ctx);
              next();
            });
            return cli;
          },
        })
      );

    writeEnvFile('.env.stage3', 'NEXT_PUBLIC_FOO3=stage3');
    process.env.APP_ENV_3 = 'stage3';
    await cli.parse(['build', '--hpsAppEnv', 'APP_ENV_3']);
    expect(process.env.NEXT_PUBLIC_FOO3).toBe('stage3');
  });
});
