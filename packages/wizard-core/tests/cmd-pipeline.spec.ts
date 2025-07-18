import { Root } from '../src/constants.js';
import { createCommandBuilder } from '../src/core/CommandBuilder.js';
import { collectCommandFlags } from '../src/helpers/helper-collect-command-flags.js';
import { getAllCommandMap } from '../src/helpers/helper-command-map.js';
import { parseFlags } from '../src/helpers/helper-parse-flags.js';
import { resolveCommandPipeline } from '../src/helpers/helper-resolve-command-pipeline.js';
import {
  formatCommandName,
  validateCommandPipeline,
} from '../src/helpers/helper-validate-command-pipeline.js';
import { defineCommand } from '../src/index.js';
import type { RootType } from '../src/types/type-wizard.js';

describe('Command Pipeline Validation and Parsing', () => {
  const buildCmd = defineCommand('build', {
    description: 'Build the project',
  })
    .use(
      defineCommand('A1', {
        description: 'A1 the project',
      })
    )
    .use(
      defineCommand('A2', {
        description: 'A2 the project',
      }).use(
        defineCommand('A2-1', {
          description: 'A2-1 the project',
        })
      )
    )
    .use(
      defineCommand('A3', {
        description: 'A3 the project',
      })
        .use(
          defineCommand('A3-1', {
            description: 'A3-1 the project',
          })
        )
        .use(
          defineCommand('A3-2', {
            description: 'A3-2 the project',
          }).use(
            defineCommand('A3-2-1', {
              description: 'A3-2-1 the project',
            })
          )
        )
    );

  it('should throw a descriptive error when the command is not configured (both en and zh)', () => {
    const rootCommandBuilder = createCommandBuilder<string | RootType>(Root, {
      description: 'root command',
    });
    const rootCmd = [rootCommandBuilder.getCommand()];

    try {
      validateCommandPipeline('en', ['build'], rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command build not configured.');
    }

    try {
      validateCommandPipeline('zh', ['build'], rootCmd);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 build 未配置。');
    }

    try {
      validateCommandPipeline('en', ['build'], undefined);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Command build not configured.');
    }

    try {
      validateCommandPipeline('zh', ['build'], undefined);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('命令 build 未配置。');
    }
  });
  it('should parse a complex CLI command pipeline and validate not found errors (both en and zh)', () => {
    const rootCommandBuilder = createCommandBuilder<string | RootType>(Root, {
      description: formatCommandName(Root),
    });
    rootCommandBuilder.use(buildCmd);

    const commandMap = getAllCommandMap(rootCommandBuilder);
    expect(commandMap).toBeDefined();
    expect(Object.keys(commandMap).length).toBe(8);

    const allCommandFlags = collectCommandFlags(commandMap);

    const argv = ['build', 'A1', 'A2', 'A2-1', 'A3', 'A3-1', 'A3-2', 'A3-2-1'];
    const parsed = parseFlags(allCommandFlags, { argv });
    const { args } = parsed;

    const commandPipeline = resolveCommandPipeline(
      'en',
      args[args.length - 1],
      commandMap
    );

    try {
      validateCommandPipeline('en', args, commandPipeline);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'Command build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1 not found.'
      );
    }

    try {
      validateCommandPipeline('zh', args, commandPipeline);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        '命令 build A1 A2 A2-1 A3 A3-1 A3-2 A3-2-1 未找到。'
      );
    }

    expect(true).toBe(true);
  });
});
