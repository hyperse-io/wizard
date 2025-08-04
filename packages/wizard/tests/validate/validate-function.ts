import { simpleDeepClone } from '@hyperse/deep-merge';
import { Root } from '../../src/constants.js';
import { createCommandBuilder } from '../../src/core/CommandBuilder.js';
import { collectCommandFlags } from '../../src/helpers/helper-collect-command-flags.js';
import { commandTreeToMap } from '../../src/helpers/helper-command-tree-to-map.js';
import { formatCommandName } from '../../src/helpers/helper-format-command-name.js';
import { parseFlags } from '../../src/helpers/helper-parse-flags.js';
import { resolveCommand } from '../../src/helpers/helper-resolve-command.js';
import { searchCommandChain } from '../../src/helpers/helper-search-command-chain.js';
import { validateCommandChain } from '../../src/helpers/helper-validate-command.js';
import { type CommandName, defineCommand } from '../../src/index.js';
import type { SupportedLocales } from '../../src/types/type-locale-messages.js';

export function validateFn(argv: string[], locale: SupportedLocales = 'zh') {
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
  const commandMap = commandTreeToMap(rootCommandBuilder);
  const [calledCommand, calledCommandName] = resolveCommand(
    locale,
    commandMap,
    simpleDeepClone({ argv }),
    {}
  );

  const parsed = parseFlags(
    calledCommand?.flags ?? {},
    simpleDeepClone({ argv })
  );

  if (!calledCommandName) {
    return;
  }

  const commandChain = searchCommandChain(calledCommandName, commandMap);
  const inputCommandFlags = collectCommandFlags(commandChain);

  return validateCommandChain(locale, inputCommandFlags, parsed, commandChain);
}
