import { rmSync } from 'node:fs';
import { createWizard } from '@hyperse/wizard-core';
import { createLoaderPlugin } from '../src/create-loader-plugin.js';
import { createFixtureFiles, sleep } from './utils/test-utils.js';

describe('Loader Plugin Integration', () => {
  let fixtureCwd: string;

  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'plugins', {
      // `version-plugin`
      'node_modules/version-plugin/package.json':
        '{"name":"version-plugin","version":"0.0.1","main":"index.js"}',
      'node_modules/version-plugin/index.js':
        'export * from "version-plugin/create-version-plugin"',
      'node_modules/version-plugin/create-version-plugin.js':
        'export const createVersionPlugin = () => { return { name: ()=>"version-plugin", setup: (wizard) => { return wizard.register("version", { description:()=>"version-plugin", handler: () => { console.log("execute version command"); } }); } }; };',

      // `help-plugin`
      'node_modules/help-plugin/package.json':
        '{"name":"help-plugin","version":"0.0.1","main":"index.js"}',
      'node_modules/help-plugin/index.js':
        'export * from "help-plugin/create-help-plugin"',
      'node_modules/help-plugin/create-help-plugin.js':
        'export const createHelpPlugin = () => { return { name: ()=>"help-plugin", setup: (wizard) => { return wizard.register("help", { description:()=>"help-plugin", handler: () => { console.log("execute help command"); } }); } }; };',
    });
  });

  afterAll(() => {
    rmSync(fixtureCwd, {
      force: true,
      recursive: true,
    });
  });

  it('should correctly load and register external plugins and their commands', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () =>
        'A test CLI for verifying plugin loading functionality',
      version: () => '1.0.0',
    });

    const loaderPlugin = await createLoaderPlugin({
      plugins: ['version-plugin'],
      pluginPackPattern: ['help-*/package.json'],
      pluginSearchDirs: [fixtureCwd],
      cwd: fixtureCwd,
    });

    cli.use(loaderPlugin);
    cli.parse(['version']);

    await sleep();

    const commandMap = cli.commandMap;
    expect(commandMap).toBeDefined();
    expect(commandMap.get('version')).toBeDefined();
    expect(commandMap.get('help')).toBeDefined();
  });
});
