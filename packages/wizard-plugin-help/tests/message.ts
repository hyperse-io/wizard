export const helpMessages = {
  en: {
    helpTestPlugin: {
      name: 'Help plugin cli',
      description:
        'A CLI plugin to test the help command functionality. Provides usage information and examples for users.',
      version: 'cli v{version}',
      help: 'Displays help information for commands and options. Use this to get more details about available commands.',
      example: 'cli --help\ncli help <command>',
      usage: 'cli help [command]',
      options: {
        '--help': 'Show help for the help command',
        '--verbose': 'Show detailed help information',
      },
      tips: 'You can use "cli help <command>" to get help for a specific command.',
    },
  },
  zh: {
    helpTestPlugin: {
      name: '帮助插件cli',
      description:
        '用于测试帮助命令功能的 CLI 插件。为用户提供使用信息和示例。',
      version: 'cli 当前版本 v{version}',
      help: '显示命令和选项的帮助信息。使用此命令可获取可用命令的详细信息。',
      example: 'cli --help\ncli help <命令>',
      usage: 'cli help [命令]',
      options: {
        '--help': '显示帮助命令的帮助信息',
        '--verbose': '显示详细的帮助信息',
      },
      tips: '你可以使用 "cli help <命令>" 获取某个命令的帮助信息。',
    },
  },
};
