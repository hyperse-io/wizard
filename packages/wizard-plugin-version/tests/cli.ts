import type { DefineMessageType } from '@hyperse/wizard';
import { createWizard } from '@hyperse/wizard';
import { createVersionPlugin } from '../src/create-version-plugin.js';
import { versionCliMessages } from './i18n/message.js';

process.env.HPS_WIZARD_LOCALE = 'en';

declare module '@hyperse/wizard' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof versionCliMessages> {}
}

const cli = createWizard({
  name: 'hps_cli',
  description: 'cli.versionCli.description',
  version: (t) => {
    return t('cli.versionCli.version', { version: '1.0.0' });
  },
  localeMessages: versionCliMessages,
  errorHandler: (e) => {
    console.log('CLI errorHandler \n', e);
  },
});

cli.use(
  createVersionPlugin({
    hiddenPrefix: true,
  })
);

cli.parse(['--version']);
