import { Root } from '../../src/constants.js';
import { createCommandBuilder } from '../../src/core/CommandBuilder.js';
import { validateCommandChain } from '../../src/helpers/helper-validate-command.js';
import {
  type CommandName,
  createWizard,
  definePlugin,
} from '../../src/index.js';
import { validateFn } from './validate-function.js';

describe('Command Pipeline Validation and Parsing', () => {
  it('should throw a descriptive error when the command is not configured (both en and zh)', () => {
    const rootCommandBuilder = createCommandBuilder<CommandName>(Root, {
      description: () => 'root command',
    });
    const rootCmd = [rootCommandBuilder.getCommand()];

    try {
      validateCommandChain(
        'en',
        {},
        {
          flags: {},
          args: ['build'],
          eofArgs: [],
          unknownFlags: {},
        },
        rootCmd
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command "build" is not properly configured.');
    }

    try {
      validateCommandChain(
        'zh',
        {},
        {
          flags: {},
          args: ['build'],
          eofArgs: [],
          unknownFlags: {},
        },
        rootCmd
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 "build" 配置不正确。');
    }

    try {
      validateCommandChain(
        'en',
        {},
        { flags: {}, args: ['build'], eofArgs: [], unknownFlags: {} },
        rootCmd
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command "build" is not properly configured.');
    }

    try {
      validateCommandChain(
        'zh',
        {},
        { flags: {}, args: ['build'], eofArgs: [], unknownFlags: {} },
        rootCmd
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 "build" 配置不正确。');
    }
  });

  it('should parse a complex CLI command pipeline and validate not found errors (both en and zh)', () => {
    const argv = ['build', 'A1', 'A2', 'A2-1', 'A3', 'A3-1', 'A3-2', 'A3-2-1'];

    try {
      validateFn(argv, 'en');
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'Command "build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1" not found. Use --help to see available commands.'
      );
    }

    try {
      validateFn(argv, 'zh');
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '未找到命令 "build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1"。使用 --help 查看可用命令。'
      );
    }
  });

  it('should throw a descriptive error when the command flag is not provided (both en and zh)', () => {
    try {
      validateFn(['build', 'A3', 'A3-2', 'A3-2-1']);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 "build A3 A3-2 A3-2-1" 需要参数 "projectCwd" 但未提供。'
      );
    }

    try {
      validateFn(['build', 'A3', 'A3-2', 'A3-2-1', '--project-cwd', 'a/b/c']);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 "build A3 A3-2 A3-2-1" 需要参数 "compiler" 但未提供。'
      );
    }

    expect(
      validateFn([
        'build',
        'A3',
        'A3-2',
        'A3-2-1',
        '--projectCwd',
        'a/b/c',
        '--compiler',
        'webpack',
      ])
    ).toBeTruthy();
  });

  it('should throw a descriptive error when the command name is invalid (both en and zh)', () => {
    try {
      const wizard = createWizard({
        name: 'wizard',
        description: () => 'wizard',
        version: () => '1.0.0',
        locale: 'en',
      });

      wizard.use(
        definePlugin({
          setup: (cli) => {
            cli.register('build ', {
              description: () => 'build command',
            });
            return cli;
          },
        })
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'Invalid command name "build " command names cannot contain spaces or multiple consecutive spaces.'
      );
    }

    try {
      const wizard = createWizard({
        name: 'wizard',
        description: () => 'wizard',
        version: () => '1.0.0',
        locale: 'zh',
      });

      wizard.use(
        definePlugin({
          setup: (cli) => {
            cli.register('build ', {
              description: () => 'build command',
            });
            return cli;
          },
        })
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '无效的命令名称 "build " 命令名称不能包含空格或连续多个空格。'
      );
    }
  });
});
