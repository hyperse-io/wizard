import { describe, expect, it } from 'vitest';
import { createWizard } from '../../src/create-wizard.js';
import { defineCommand } from '../../src/define-command.js';
import { definePlugin } from '../../src/define-plugin.js';

const messages = {
  en: {
    cli: {
      name: 'Wizard Test',
      description: 'Wizard Test description',
      version: 'Wizard Test version {version}',
    },
  },
  zh: {
    cli: {
      name: '测试 cli 名称',
      description: '测试 cli 描述',
      version: '测试 cli 版本 {version}',
    },
  },
};

describe('Wizard CLI internationalization support', () => {
  it('should support overriding messages via overrideMessages (Chinese locale)', () => {
    process.env.HPS_WIZARD_LOCALE = 'zh';

    const cli = createWizard({
      name: 'cli.name',
      description: 'cli.description',
      localeMessages: messages,
      version: (t) => {
        return t('cli.version', { version: '1.0.0' });
      },
      errorHandler: () => {},
    });

    expect(cli.name).toBe('测试 cli 名称');
    expect(cli.description).toBe('测试 cli 描述');
    expect(cli.version).toBe('测试 cli 版本 1.0.0');
  });

  it('should support parsing messages via plugin and overrideMessages (English locale)', () => {
    process.env.HPS_WIZARD_LOCALE = 'en';

    const cli = createWizard({
      name: 'cli.name',
      description: 'cli.description',
      localeMessages: messages,
      version: (t) => {
        return t('cli.version', { version: '1.0.0' });
      },
      errorHandler: () => {},
    })
      .use(
        definePlugin({
          name: () => 'pluginA',
          setup: (wizard, pluginCtx) => {
            console.log(pluginCtx);
            wizard.register(
              defineCommand('commandA', {
                description: () => 'commandA.description',
              })
            );
            wizard.register(
              defineCommand('commandB', {
                description: () => 'commandA.description',
              })
            );

            console.log(wizard.getLocale());
            return wizard.register(
              defineCommand<
                'commandC',
                {
                  projectCwd: string;
                }
              >('commandC', {
                description: () => 'commandA.description',
              })
            );
          },
        })
      )
      .on('commandC', (ctx) => {
        ctx.ctx.projectCwd = 'a/b/c';
      });

    expect(cli.name).toBe('Wizard Test');
    expect(cli.description).toBe('Wizard Test description');
    expect(cli.version).toBe('Wizard Test version 1.0.0');
  });
});
