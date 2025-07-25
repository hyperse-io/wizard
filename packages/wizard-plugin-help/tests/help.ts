import {
  createWizard,
  defineCommand,
  definePlugin,
} from '@hyperse/wizard-core';
import { createHelpPlugin } from '../src/create-help-plugin.js';
import { helpMessages } from './message.js';

const evolve = defineCommand('evolve', {
  description: () => 'evolve description',
}).flags({
  evolveName: {
    type: String,
    default: 'evolveName',
    description: () => 'evolveName',
  },
});

const migrate = defineCommand('migrate', {
  description: () => 'migrate description',
}).flags({
  migrateName: {
    type: String,
    default: 'evolveName',
    description: () => 'evolveName',
  },
});

const cli = createWizard({
  name: 'cli.helpTestPlugin.name',
  description: 'cli.helpTestPlugin.description',
  version: (t) => {
    return t('cli.helpTestPlugin.version', { version: '1.0.0' });
  },
  localeMessages: helpMessages,
  errorHandler: (e) => {
    console.log('CLI errorHandler \n', e);
  },
})
  .use(createHelpPlugin())
  .use(
    definePlugin({
      setup: (cli) => {
        return cli.register(
          defineCommand('build', {
            description: () => 'build',
          })
            .flags({
              projectCwd: {
                type: String,
                default: 'projectCwd',
                description: () => 'projectCwd',
              },
              type: {
                type: Boolean,
                default: true,
                description: () => 'type',
              },
              timeout: {
                type: Number,
                description: () => 'time',
              },
            })
            .use(evolve, migrate)
        );
      },
    })
  )
  .flag('version', {
    type: Boolean,
    default: true,
    description: () => 'versionversionversion',
  })
  .flag('version2', {
    type: Number,
    default: 1,
    description: () => 'version2version2version2version2',
  })
  .flag('version3', {
    type: String,
    default: 'version3',
    description: () => 'version3version3version3',
  });
cli.parse(['build', '-h']);
