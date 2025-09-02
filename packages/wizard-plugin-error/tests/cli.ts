import {
  createWizard,
  type DefineMessageType,
  definePlugin,
} from '@hyperse/wizard';
import { createErrorPlugin } from '../src/create-error-plugin.js';
import { errorCliMessages } from './i18n/message.js';

process.env.HPS_WIZARD_LOCALE = 'zh';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof errorCliMessages> {}
}

const plugin = createErrorPlugin();

const cli = createWizard({
  name: 'hps_cli',
  description: 'cli.errorCli.description',
  version: 'cli.errorCli.version',
  localeMessages: errorCliMessages,
});

const a = cli
  .use(plugin)
  .use(
    definePlugin({
      name: () => 'test plugin',
      setup: (cli) => {
        return cli.register('test', {
          description: () => 'test',
          process: () => {
            console.log('execute test');
          },
        });
      },
    })
  )
  .on('test', (ctx) => {
    console.log('test');
  });

cli.parse(['testa']);
