import { simpleDeepClone } from '@hyperse/deep-merge';
import { Root } from '../../src/constants.js';
import { createCommandBuilder } from '../../src/core/CommandBuilder.js';
import { CommandNotProviderError } from '../../src/errors/CommandNotProviderError.js';
import { collectCommandFlags } from '../../src/helpers/helper-collect-command-flags.js';
import { getAllCommandMap } from '../../src/helpers/helper-command-map.js';
import { formatCommandName } from '../../src/helpers/helper-format-command-name.js';
import { parseFlags } from '../../src/helpers/helper-parse-flags.js';
import { searchCommandChain } from '../../src/helpers/helper-search-command-chain.js';
import { validateCommandPipeline } from '../../src/helpers/helper-validate-command-pipeline.js';
import {
  type CommandName,
  defineCommand,
  type LocaleMessagesKeys,
} from '../../src/index.js';

export function validateFn(argv: string[], locale: LocaleMessagesKeys = 'zh') {
  const buildCmd = defineCommand('build', {
    description: () => 'Build the project',
  })
    .use(
      defineCommand('A1', {
        description: () => 'A1 the project',
      })
    )
    .use(
      defineCommand('A2', {
        description: () => 'A2 the project',
      }).use(
        defineCommand('A2-1', {
          description: () => 'A2-1 the project',
        })
      )
    )
    .use(
      defineCommand('A3', {
        description: () => 'A3 the project',
      })
        .use(
          defineCommand('A3-1', {
            description: () => 'A3-1 the project',
          })
        )
        .use(
          defineCommand('A3-2', {
            description: () => 'A3-2 the project',
          }).use(
            defineCommand('A3-2-1', {
              description: () => 'A3-2-1 the project',
            }).flags({
              projectCwd: {
                type: String,
                required: true,
                description: () => 'project cwd',
              },
              compiler: {
                type: [String],
                default: undefined,
                required: true,
                description: () => 'compiler',
              },
              throwError: {
                type: Boolean,
                required: false,
                description: () => 'throw error',
              },
            })
          )
        )
    );

  const rootCommandBuilder = createCommandBuilder<CommandName>(Root, {
    description: () => formatCommandName(Root),
  });
  rootCommandBuilder.use(buildCmd);
  const commandMap = getAllCommandMap(rootCommandBuilder);
  const allCommandFlags = collectCommandFlags(Object.values(commandMap));
  const parsed = parseFlags(allCommandFlags, simpleDeepClone({ argv }));
  const { args } = parsed;

  const inputCommands = args || [];

  if (!inputCommands || inputCommands.length === 0) {
    throw new CommandNotProviderError(locale);
  }

  const commandPipeline = searchCommandChain(
    locale,
    args[args.length - 1],
    commandMap
  );
  const inputCommandFlags = collectCommandFlags(commandPipeline);

  return validateCommandPipeline(
    locale,
    inputCommandFlags,
    args,
    parsed,
    commandPipeline
  );
}
