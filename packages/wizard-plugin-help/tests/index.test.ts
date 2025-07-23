import {
  createWizard,
  defineCommand,
  definePlugin,
  useLocale,
} from '@hyperse/wizard-core';

declare module '@hyperse/wizard-core' {
  interface LocaleMessages {
    command2: {
      build: {
        description: string;
      };
    };
  }
}

describe('DEMO', () => {
  it('should render', () => {
    const t = useLocale('en');

    const cli = createWizard({
      name: 'command2',
      description: 'command2.build.description',
      version: () => '1.0.0',
    });

    const demoCmd = defineCommand('demo', {
      description: 'command2.build.description',
    })
      .handler((ctx) => {
        const { t } = ctx.i18n;
        t('command2.build');
      })
      .resolver((ctx) => {
        const { t } = ctx.i18n;
        t('command2.build');
      });

    cli
      .use(
        definePlugin({
          localeMessages: {
            en: {
              command2: {
                build: {
                  description: 'build description',
                },
              },
            },
            zh: {
              command2: {
                build: {
                  description: 'build description',
                },
              },
            },
          },
          setup: (wizard) => {
            const { t } = wizard.i18n;
            return wizard.register(demoCmd);
          },
        })
      )
      .on('demo', (ctx) => {
        ctx.i18n.t('command2.build');
      });

    expect('demoCore').toBe('demoCore');
  });
});
