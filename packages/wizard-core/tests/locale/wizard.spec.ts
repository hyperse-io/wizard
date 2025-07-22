import { describe, expect, it } from 'vitest';
import type { DeepPartial } from '@hyperse/deep-merge';
import { createWizard } from '../../src/create-wizard.js';
import type { DefaultLocaleMessages } from '../../src/types/type-locale-messages.js';

const messages: DeepPartial<DefaultLocaleMessages> = {
  en: {
    core: {
      cli: {
        name: 'Wizard Test',
        description: 'Wizard Test description',
        version: 'Wizard Test version {version}',
      },
    },
  },
  zh: {
    core: {
      cli: {
        name: '测试 cli 名称',
        description: '测试 cli 描述',
        version: '测试 cli 版本 {version}',
      },
    },
  },
};

describe('Wizard CLI internationalization support', () => {
  it('should support overriding messages via overrideMessages (Chinese locale)', () => {
    process.env.HPS_WIZARD_LOCALE = 'zh';

    const cli = createWizard({
      name: 'core.cli.name',
      description: 'core.cli.description',
      overrideMessages: messages,
      version: (t) => {
        return t('core.cli.version', { version: '1.0.0' });
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
      name: 'core.cli.name',
      description: 'core.cli.description',
      overrideMessages: messages,
      version: (t) => {
        return t('core.cli.version', { version: '1.0.0' });
      },
      errorHandler: () => {},
    });

    expect(cli.name).toBe('Wizard Test');
    expect(cli.description).toBe('Wizard Test description');
    expect(cli.version).toBe('Wizard Test version 1.0.0');
  });
});
