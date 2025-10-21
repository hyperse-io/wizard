import type { DefineMessageType } from '@hyperse/wizard';
import { createWizard, defineCommand, definePlugin } from '@hyperse/wizard';
import { createCompletionPlugin } from '../src/create-completion-plugin.js';
import { completionMessages } from '../src/index.js';

process.env.HPS_WIZARD_LOCALE = 'en';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof completionMessages> {}
}

const cliTest = createWizard({
  name: 'hps_cli',
  description: () => 'hps cli',
  version: () => 'v1.0.0',
  localeMessages: completionMessages,
  errorHandler: (e) => {
    console.log('CLI errorHandler \n', e);
  },
});

cliTest
  .use(createCompletionPlugin())
  .use(
    definePlugin({
      name: () => 'a',
      setup: (wizard) => {
        const cli = wizard.register(
          defineCommand('A_Cmd', {
            description: () => 'A_Cmd',
          })
            .use(
              defineCommand('A_1_Cmd', {
                description: () => 'A_1_Cmd',
              })
            )
            .use(
              defineCommand('A_2_Cmd', {
                description: () => 'A_2_Cmd',
              })
            )
        );
        return cli;
      },
    })
  )
  .use(
    definePlugin({
      name: () => 'b',
      setup: (wizard) => {
        const cli = wizard.register(
          defineCommand('B_Cmd', {
            description: () => 'B_Cmd',
          })
            .use(
              defineCommand('B_1_Cmd', {
                description: () => 'B_1_Cmd',
              })
            )
            .use(
              defineCommand('B_2_Cmd', {
                description: () => 'B_2_Cmd',
              })
            )
        );
        return cli;
      },
    })
  );

export { cliTest };
