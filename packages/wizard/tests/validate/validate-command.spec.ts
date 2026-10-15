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

    expect(() =>
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
      )
    ).toThrow('Command "build" is not properly configured.');

    expect(() =>
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
      )
    ).toThrow('命令 "build" 配置不正确。');

    expect(() =>
      validateCommandChain(
        'en',
        {},
        { flags: {}, args: ['build'], eofArgs: [], unknownFlags: {} },
        rootCmd
      )
    ).toThrow('Command "build" is not properly configured.');

    expect(() =>
      validateCommandChain(
        'zh',
        {},
        { flags: {}, args: ['build'], eofArgs: [], unknownFlags: {} },
        rootCmd
      )
    ).toThrow('命令 "build" 配置不正确。');
  });

  it('should parse a complex CLI command pipeline and validate not found errors (both en and zh)', () => {
    const argv = ['build', 'A1', 'A2', 'A2-1', 'A3', 'A3-1', 'A3-2', 'A3-2-1'];

    expect(() => validateFn(argv, 'en')).toThrow(
      'Command "build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1" not found. Use --help to see available commands.'
    );

    expect(() => validateFn(argv, 'zh')).toThrow(
      '未找到命令 "build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1"。使用 --help 查看可用命令。'
    );
  });

  it('should throw a descriptive error when the command flag is not provided (both en and zh)', () => {
    expect(() => validateFn(['build', 'A3', 'A3-2', 'A3-2-1'])).toThrow(
      '命令 "build A3 A3-2 A3-2-1" 需要参数 "projectCwd" 但未提供。'
    );

    expect(() =>
      validateFn(['build', 'A3', 'A3-2', 'A3-2-1', '--project-cwd', 'a/b/c'])
    ).toThrow('命令 "build A3 A3-2 A3-2-1" 需要参数 "compiler" 但未提供。');

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
    const buildPlugin = definePlugin({
      name: () => 'build plugin',
      setup: (cli) => {
        cli.register('build ', {
          description: () => 'build command',
        });
        return cli;
      },
    });

    // `commandTreeToMap` normalises the registered name through
    // `formatCommandName`, so a trailing space is stripped at the map key level
    // and the name check never sees the invalid form.
    expect(() => {
      const wizard = createWizard({
        name: 'wizard',
        description: () => 'wizard',
        version: () => '1.0.0',
        locale: 'en',
      });

      wizard.use(buildPlugin);
    }).not.toThrow();

    expect(() => {
      const wizard = createWizard({
        name: 'wizard',
        description: () => 'wizard',
        version: () => '1.0.0',
        locale: 'zh',
      });

      wizard.use(buildPlugin);
    }).not.toThrow();
  });
});
