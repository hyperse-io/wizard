export const messages = {
  en: {
    core: {
      command: {
        notProvider: 'Command not provided.',
        nameConflict:
          'Command name {newCmdName} conflicts with {oldCmdName}. Maybe caused by alias.',
        flagNotProvided:
          'Command {cmdName} required flag {flagName} not provided.',
        notConfiguration: 'Command {cmdName} not configured.',
        notFound: 'Command {cmdName} not found.',
        handlerNotFound: 'Command {cmdName} not found handler.',
        invalidName: 'Command {cmdName} is invalid.',
      },
    },
  },
  zh: {
    core: {
      command: {
        notProvider: '命令未提供。',
        flagNotProvided: '命令 {cmdName} 的 {flagName} 参数未提供。',
        nameConflict:
          '命令名称 {newCmdName} 与 {oldCmdName} 冲突。可能是别名导致的。',
        notConfiguration: '命令 {cmdName} 未配置。',
        notFound: '命令 {cmdName} 未找到。',
        handlerNotFound: '命令 {cmdName} 未找到处理函数。',
        invalidName: '命令 {cmdName} 无效。',
      },
    },
  },
};
