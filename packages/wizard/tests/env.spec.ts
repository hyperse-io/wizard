import fs from 'node:fs';
import { LogLevel } from '@hyperse/logger';
import { createWizard } from '../src/create-wizard.js';
import { defineCommand } from '../src/define-command.js';
import { definePlugin } from '../src/index.js';

function writeEnvFile(name: string, text: string) {
  const path = fs.realpathSync(process.cwd());
  fs.writeFileSync(`${path}/${name}`, text);
}

describe('builtin flags', () => {
  const buildHandler = vi.fn();
  const globalInterceptorHandler = vi.fn();
  const helpInterceptorHandler = vi.fn();
  const originalPrinter = process.stdout.write;

  afterEach(() => {
    process.stdout.write = originalPrinter;
    vi.resetAllMocks();
    vi.clearAllMocks();
    const files = ['.env', '.env.stage1', '.env.stage2'];
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

  it('test command build with env flags', async () => {
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
});
