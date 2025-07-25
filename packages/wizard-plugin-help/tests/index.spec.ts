import type { DefineMessageType } from '@hyperse/wizard-core';
import { createWizard } from '@hyperse/wizard-core';
import { createHelpPlugin } from '../src/create-help-plugin.js';
import { helpMessages } from './message.js';

declare module '@hyperse/wizard-core' {
  export interface CliLocaleMessages
    extends DefineMessageType<typeof helpMessages> {}
}

describe('DEMO', () => {
  it('should render', () => {
    const cli = createWizard({
      name: 'cli.helpTestPlugin.name',
      description: 'cli.helpTestPlugin.description',
      version: (t) => {
        return t('cli.helpTestPlugin.version', { version: '1.0.0' });
      },
      localeMessages: helpMessages,
      errorHandler: (e) => {
        console.log(e);
      },
    });

    cli.use(createHelpPlugin());

    cli.parse(['--help']);
    expect('demoCore').toBe('demoCore');
  });
});
