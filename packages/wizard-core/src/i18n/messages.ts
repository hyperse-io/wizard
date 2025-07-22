export const messages = {
  en: {
    core: {
      cli: {
        name: 'Wizard CLI',
        description: 'A CLI for Wizard.',
        version: '{version}',
        rootDescription: 'The root command of the wizard.',
        parseMustBeCalled: 'cli.parse() must be called.',
      },
      command: {
        notProvider: 'Command not provided.',
        nameConflict:
          'Command name {newCmdName} conflicts with {oldCmdName}. Maybe caused by alias.',
        flagNotProvided:
          'Command {cmdName} required flag {flagName} not provided.',
        notConfiguration: 'Command {cmdName} not configured.',
        notFound: 'Command {cmdName} not found.',
        handlerNotFound: 'Command {cmdName} not found handler.',
        localeNotFound: 'Command {cmdName} not found locale.',
        invalidName: 'Command {cmdName} is invalid.',
      },
    },
  },
  zh: {
    core: {
      cli: {
        name: 'Wizard CLI',
        description: 'Wizard 的命令行工具。',
        version: '{version}',
        rootDescription: 'wWizard 的根命令。',
        parseMustBeCalled: 'cli.parse() 必须被调用。',
      },
      command: {
        notProvider: '命令未提供。',
        flagNotProvided: '命令 {cmdName} 的 {flagName} 参数未提供。',
        nameConflict:
          '命令名称 {newCmdName} 与 {oldCmdName} 冲突。可能是别名导致的。',
        notConfiguration: '命令 {cmdName} 未配置。',
        notFound: '命令 {cmdName} 未找到。',
        handlerNotFound: '命令 {cmdName} 未找到处理函数。',
        localeNotFound: '命令 {cmdName} 未找到本地化配置。',
        invalidName: '命令 {cmdName} 无效。',
      },
    },
  },
};
