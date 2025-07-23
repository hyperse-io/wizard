import { describe, expect, it } from 'vitest';
import { createWizard } from '../../src/create-wizard.js';
import type { DefineMessageType } from '../../src/types/type-locale-messages.js';

declare module '../../src/types/type-locale-messages.js' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof messages> {}
}

const messages = {
  en: {
    wizardTest: {
      name: 'Wizard Test',
      description: 'Wizard Test description',
      version: 'Wizard Test version {version}',
    },
  },
  zh: {
    wizardTest: {
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
      name: 'cli.wizardTest.name',
      description: 'cli.wizardTest.description',
      localeMessages: messages,
      version: (t) => {
        return t('cli.wizardTest.version', { version: '1.0.0' });
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
      name: 'cli.wizardTest.name',
      description: 'cli.wizardTest.description',
      localeMessages: messages,
      version: (t) => {
        return t('cli.wizardTest.version', { version: '1.0.0' });
      },
      errorHandler: () => {},
    });

    expect(cli.name).toBe('Wizard Test');
    expect(cli.description).toBe('Wizard Test description');
    expect(cli.version).toBe('Wizard Test version 1.0.0');
  });

  it('should return the correct locale (English locale)', () => {
    process.env.HPS_WIZARD_LOCALE = 'en';

    const cli = createWizard({
      name: 'cli.wizardTest.name',
      description: 'cli.wizardTest.description',
      version: (t) => {
        return t('cli.wizardTest.version', { version: '1.0.0' });
      },
      errorHandler: () => {},
    });

    expect(cli.name).toBe('en.cli.wizardTest.name');
    expect(cli.description).toBe('en.cli.wizardTest.description');
    expect(cli.version).toBe('en.cli.wizardTest.version');
  });
});
