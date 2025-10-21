import { defineLocaleMessages } from '@hyperse/wizard';

export const completionMessages = defineLocaleMessages({
  en: {
    completionPlugin: {
      name: 'Command Autocomplete Plugin',
      command: {
        description:
          'Provides intelligent and context-aware CLI command autocompletion based on Fig, supporting a wide range of completions for various commands and supporting both Fig and Amazon Q scenarios.',
        flags: {
          output:
            'The directory corresponding to the Fig spec configuration file.',
        },
      },
    },
  },
  zh: {
    completionPlugin: {
      name: '命令自动补全插件',
      command: {
        description:
          '基于 Fig 提供智能、上下文感知的命令行自动补全，支持各种命令的补全，兼容 Fig 与 Amazon Q 等多种场景。',
        flags: {
          output: 'Fig spec 配置文件对应的目录',
        },
      },
    },
  },
});
