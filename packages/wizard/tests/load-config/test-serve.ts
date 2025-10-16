import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createWizard } from '../../src/create-wizard.js';
import { defineCommand } from '../../src/define-command.js';
import { definePlugin } from '../../src/define-plugin.js';

const mockCmd = defineCommand<'mock', { root: { root1: string } }>('mock', {
  description: () => 'mock description',
  loadConfig: true,
}).process(() => {
  console.log('mock process');
});

const projectCwd = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

const cli = createWizard({
  name: 'Wizard',
  description: () => 'wWizard description',
  version: () => '1.0.0',
  locale: 'en',
  configLoaderOptions: {
    configFile: 'wizard',
  },
}).use(
  definePlugin({
    name: () => 'mockPlugin',
    setup: (wizard) => {
      return wizard.register(mockCmd);
    },
  })
);
// cmd: mock
await cli.parse(['mock', '--projectCwd', projectCwd]);
