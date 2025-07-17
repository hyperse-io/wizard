export const messages = {
  en: {
    cli: {
      parseMustBeCalled: 'cli.parse() must be called.',
    },
    command: {
      nameConflict:
        'Command name {newCmdName} conflicts with {oldCmdName}. Maybe caused by alias.',
      notConfiguration: 'Command {cmdName} not configured.',
      notFound: 'Command {cmdName} not found.',
    },
  },
  zh: {
    cli: {
      parseMustBeCalled: 'cli.parse() 必须被调用。',
    },
    command: {
      nameConflict:
        '命令名称 {newCmdName} 与 {oldCmdName} 冲突。可能是别名导致的。',
      notConfiguration: '命令 {cmdName} 未配置。',
      notFound: '命令 {cmdName} 未找到。',
    },
  },
};
