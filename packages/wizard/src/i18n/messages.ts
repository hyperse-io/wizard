import { defineLocaleMessages } from '../define-locale-messages.js';

export type CoreLocaleMessages = {
  command: {
    notProvider: string;
    nameConflict: string;
    flagNotProvided: string;
    notConfiguration: string;
    notFound: string;
    processNotFound: string;
    invalidName: string;
    invalidFlagsValue: string;
  };
  flags: {
    noColor: string;
    logLevel: string;
    hpsAppEnv: string;
    hpsEnvPath: string;
  };
};

export const coreMessages = defineLocaleMessages({
  en: {
    core: {
      command: {
        notProvider:
          'No command specified. Please provide a command to execute.',
        nameConflict:
          'Command name "{newCmdName}" conflicts with existing command "{oldCmdName}". This may be caused by duplicate aliases.',
        flagNotProvided:
          'Command "{cmdName}" requires the flag "{flagName}" but it was not provided.',
        notConfiguration: 'Command "{cmdName}" is not properly configured.',
        notFound:
          'Command "{cmdName}" not found. Use --help to see available commands.',
        processNotFound: 'Command "{cmdName}" has no process defined.',
        invalidName:
          'Invalid command name "{cmdName}" command names cannot contain spaces or multiple consecutive spaces.',
        invalidFlagsValue:
          'Invalid value "{flagValue}" for flag "{flagName}". Supported values are: {flagValues}',
      },
      flags: {
        noColor: 'Disable colored output in terminal',
        logLevel: 'Set log level. options: Error, Warn, Info, Debug, Verbose',
        hpsAppEnv: 'Process env key, default: APP_ENV',
        hpsEnvPath: 'Process env file path',
        projectCwd: 'Project working directory',
      },
    },
  },
  zh: {
    core: {
      command: {
        notProvider: '未指定命令。请提供一个要执行的命令。',
        flagNotProvided: '命令 "{cmdName}" 需要参数 "{flagName}" 但未提供。',
        nameConflict:
          '命令名称 "{newCmdName}" 与现有命令 "{oldCmdName}" 冲突。这可能是由重复的别名导致的。',
        notConfiguration: '命令 "{cmdName}" 配置不正确。',
        notFound: '未找到命令 "{cmdName}"。使用 --help 查看可用命令。',
        processNotFound: '命令 "{cmdName}" 未定义处理函数。',
        invalidName:
          '无效的命令名称 "{cmdName}" 命令名称不能包含空格或连续多个空格。',
        invalidFlagsValue:
          '无效的参数值 "{flagValue}"，参数 "{flagName}" 支持的值为：{flagValues}',
      },
      flags: {
        noColor: '禁用终端日志输出颜色',
        logLevel: '设置日志级别，可选值：Error, Warn, Info, Debug, Verbose',
        hpsAppEnv: '进程环境变量，默认值：APP_ENV',
        hpsEnvPath: '进程环境变量文件路径',
        projectCwd: '项目工作目录',
      },
    },
  },
});
