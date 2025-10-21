import { defineCommand, definePlugin } from '@hyperse/wizard';
import { generateFigSpec } from './helpers/helper-generate-fig-spec.js';
import { completionMessages } from './i18n/messages.js';

export const createCompletionPlugin = () => {
  return definePlugin({
    name: 'plugins.completionPlugin.name',
    localeMessages: completionMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand('completion', {
          description: 'plugins.completionPlugin.command.description',
        })
          .flags({
            output: {
              type: Boolean,
              description: 'plugins.completionPlugin.command.flags.output',
              default: true,
            },
          })
          .process(async (ctx) => {
            const { output } = ctx?.flags || {};
            if (!output) {
              return;
            }
            const outputPath = await generateFigSpec(wizard);
            process.stdout.write(outputPath);
            process.stdout.write('\n');
          })
      );
      return cli;
    },
  });
};
