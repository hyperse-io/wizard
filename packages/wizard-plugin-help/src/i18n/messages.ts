export const helpMessages = {
  en: {
    helpPlugin: {
      name: 'CLI Help Plugin',
      command: {
        description: 'Show help information',
        example: 'cli --help or cli -h',
      },
      flags: {
        help: 'Show help information',
      },
      message: {
        name: 'Name:',
        version: 'Version:',
        subcommand: 'Subcommand:',
        commands: 'Commands:',
        globalFlags: 'Global Flags:',
        flags: 'Flags:',
        description: 'Description:',
        usage: 'Usage:',
        examples: 'Examples:',
        help: 'Help:',
        default: 'Default: {value}',
        required: 'Required',
      },
    },
  },
  zh: {
    helpPlugin: {
      name: '帮助信息插件',
      command: {
        description: '展示帮助信息',
        example: 'cli --help 或 cli -h',
      },
      flags: {
        help: '展示帮助信息',
      },
      message: {
        name: '名称:',
        version: '版本:',
        subcommand: '子命令:',
        commands: '命令:',
        globalFlags: '全局参数:',
        flags: '参数:',
        description: '描述:',
        usage: '使用:',
        examples: '示例:',
        help: '帮助:',
        default: '默认值: {value}',
        required: '必填',
      },
    },
  },
};
