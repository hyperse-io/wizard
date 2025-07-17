import { defineCommand } from '../src/core/defineCommand.js';
import { Wizard } from '../src/core/Wizard.js';
import { definePlugin } from '../src/index.js';

describe('cli', () => {
  it('should be able to parse the cli', () => {
    const buildCmd = defineCommand<'build', { root: { root1: string } }>(
      'build',
      {
        description: 'build description description description description',
      }
    )
      .flags({
        projectCwd: {
          alias: 'p',
          type: String,
          description: 'project cwd',
          default: 'a/b/v/d',
        },
      })
      .use(
        defineCommand<'evolve', { root1: { root11: string } }>('evolve', {
          description: 'evolve description description description description',
        })
          .flags({
            compiler: {
              type: String,
              alias: 'c',
              description: 'compiler with rspack or vite',
              default: 'rspack',
            },
            env: {
              type: String,
              alias: 'e',
              description: 'env with dev or prod',
              default: 'dev',
            },
          })
          .use(
            defineCommand<'mini', { root12: { root112: string } }>('mini', {
              description:
                'mini description description description description',
            })
              .flags({
                version: {
                  type: String,
                  alias: 'v',
                  description: 'version with 1.0.0 or 2.0.0',
                  default: '1.0.0',
                },
              })
              .handler((ctx) => {
                console.log('====>>>mini ctx', ctx.flags.version);
              })
          )
          .resolver(() => {
            return { root12: { root112: 'mini' } };
          })
      )
      .handler((ctx) => {
        console.log('====>>>mini ctx', ctx.flags.projectCwd);
      });

    const deployCmd = defineCommand<'deploy', { root1: { root11: string } }>(
      'deploy',
      {
        description: 'deploy description description description description',
      }
    )
      .flags({
        fileType: {
          type: String,
          alias: 'f',
          description: 'file type with js or ts',
          default: 'js',
        },
        ossType: {
          type: String,
          alias: 'o',
          description: 'oss type with aliyun or tencent',
          default: 'aliyun',
        },
      })
      .handler((ctx) => {
        console.log('====>>>deploy ctx', ctx.flags.ossType);
      });

    const wWizard = new Wizard({
      name: 'wWizard',
      description: 'wWizard description',
      version: '1.0.0',
      errorHandler: (err) => {
        console.log('====>>> err', err);
      },
    });

    const argv = [
      'build',
      'evolve',
      '--compiler',
      'vite',
      '--version',
      '1.0.1',
      '--',
      'mini',
    ];

    const newCli = wWizard
      .use(
        definePlugin({
          setup: (wizard) => {
            const cli = wizard.register(buildCmd);
            cli.on('build.evolve.mini', (ctx) => {
              console.log('====>>> ctx', ctx);
            });
            return cli;
          },
        })
      )
      .use(
        definePlugin({
          setup: (wizard) => {
            const cli = wizard.register(deployCmd);
            return cli;
          },
        })
      );

    newCli
      .on('deploy', (ctx) => {
        console.log(ctx?.root1.root11);
      })
      .parse(argv);

    expect(true).toBe(true);
  });
});
