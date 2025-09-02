import { defineLocaleMessages } from '@hyperse/wizard';

export const helpCliMessages = defineLocaleMessages({
  en: {
    helpCli: {
      description: 'CLI description',
      version: 'CLI v1.0.0',
    },
  },
  zh: {
    helpCli: {
      description: '帮助信息插件',
      version: 'CLI v1.0.0',
    },
  },
});

export const buildPluginMessages = defineLocaleMessages({
  en: {
    versionPlugin: {
      description: 'version description',
    },
    buildPlugin: {
      description: 'build command description',
      example: 'build --projectCwd ./project --type --timeout 1000',
      help: 'build help',
      flags: {
        projectCwd: 'projectCwd description',
        type: 'type description',
        timeout: 'timeout description',
      },
    },
    evolvePlugin: {
      description: 'evolve command description',
      example: 'evolve --evolveName evolveName',
      help: 'evolve help',
      flags: {
        evolveName: 'evolveName description',
      },
    },
    migratePlugin: {
      description: 'migrate description',
      example: 'migrate --migrateName migrateName',
      help: 'migrate help',
      flags: {
        migrateName: 'migrateName description',
      },
    },
  },
  zh: {
    versionPlugin: {
      description: 'version 插件',
    },
    buildPlugin: {
      description: '构建命令描述',
      example: 'build --projectCwd ./project --type --timeout 1000',
      help: 'build 帮助信息',
      flags: {
        projectCwd: 'projectCwd 描述',
        type: 'type 描述',
        timeout: 'timeout 描述',
      },
    },
    evolvePlugin: {
      description: 'evolve 命令描述',
      example: 'evolve --evolveName evolveName',
      help: 'evolve 帮助信息',
      flags: {
        evolveName: 'evolveName 描述',
      },
    },
    migratePlugin: {
      description: 'migrate 命令描述',
      example: 'migrate --migrateName migrateName',
      help: 'migrate 帮助信息',
      flags: {
        migrateName: 'migrateName 描述',
      },
    },
  },
});
