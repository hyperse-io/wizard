import { Root } from '../../src/constants.js';
import { createCommandBuilder } from '../../src/core/CommandBuilder.js';
import { validateCommandPipeline } from '../../src/helpers/helper-validate-command-pipeline.js';
import type { CommandName } from '../../src/index.js';
import { validateFn } from './validate-function.js';

describe('Command Pipeline Validation and Parsing', () => {
  it('should throw a descriptive error when the command is not configured (both en and zh)', () => {
    const rootCommandBuilder = createCommandBuilder<CommandName>(Root, {
      description: () => 'root command',
    });
    const rootCmd = [rootCommandBuilder.getCommand()];

    try {
      validateCommandPipeline('en', {}, ['build'], undefined, rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command build not configured.');
    }

    try {
      validateCommandPipeline('zh', {}, ['build'], undefined, rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 build 未配置。');
    }

    try {
      validateCommandPipeline('en', {}, ['build'], undefined, rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command build not configured.');
    }

    try {
      validateCommandPipeline('zh', {}, ['build'], undefined, rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 build 未配置。');
    }
  });
  it('should parse a complex CLI command pipeline and validate not found errors (both en and zh)', () => {
    const argv = ['build', 'A1', 'A2', 'A2-1', 'A3', 'A3-1', 'A3-2', 'A3-2-1'];

    try {
      validateFn(argv, 'en');
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'Command build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1 not found.'
      );
    }

    try {
      validateFn(argv, 'zh');
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1 未找到。'
      );
    }
  });

  it('should throw a descriptive error when the command flag is not provided (both en and zh)', () => {
    try {
      validateFn(['build', 'A3', 'A3-2', 'A3-2-1']);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 build A3 A3-2 A3-2-1 的 projectCwd 参数未提供。'
      );
    }

    try {
      validateFn(['build', 'A3', 'A3-2', 'A3-2-1', '--project-cwd', 'a/b/c']);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 build A3 A3-2 A3-2-1 的 compiler 参数未提供。'
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
});
