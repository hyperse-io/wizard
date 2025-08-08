import { defineLocaleMessages } from '@hyperse/wizard';

export const versionMessages = defineLocaleMessages({
  en: {
    versionPlugin: {
      name: 'CLI Version plugin',
      description: 'Show CLI version',
      command: {
        description: 'Show CLI version',
        example: 'cli --version or cli -V',
      },
      flags: {
        version: 'Show CLI version',
      },
    },
  },
  zh: {
    versionPlugin: {
      name: 'CLI 版本插件',
      description: '展示 CLI 版本',
      command: {
        description: '展示 CLI 版本信息',
        example: 'cli --version 或 cli -V',
      },
      flags: {
        version: '展示 CLI 版本',
      },
    },
  },
});
