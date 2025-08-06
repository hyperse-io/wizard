import { rmSync } from 'node:fs';
import { loadCliPlugins } from '../src/helpers/helper-load-plugin.js';
import { createFixtureFiles } from './utils/test-utils.js';

describe('load cli command plugins', () => {
  let fixtureCwd: string;

  beforeAll(() => {
    fixtureCwd = createFixtureFiles(import.meta.url, 'plugins', {
      // `@hps/cli-plugin-a`
      'node_modules/@hps/cli-plugin-a/package.json':
        '{"name":"@hps/cli-plugin-a","version":"0.0.1","main":"index.js"}',
      'node_modules/@hps/cli-plugin-a/index.js': 'console.log("a")',

      // `@hps/cli-plugin-b`
      'node_modules/@hps/cli-plugin-b/package.json':
        '{"name":"@hps/cli-plugin-b","version":"0.0.1","main":"index.js"}',
      'node_modules/@hps/cli-plugin-b/index.js': 'console.log("b")',

      // `hps-cli-plugin-a`
      'node_modules/hps-cli-plugin-a/package.json':
        '{"name":"hps-cli-plugin-a","version":"0.0.1","main":"index.js"}',
      'node_modules/hps-cli-plugin-a/index.js': 'console.log("c")',

      // `hps-cli-plugin-b`
      'node_modules/hps-cli-plugin-b/package.json':
        '{"name":"hps-cli-plugin-b","version":"0.0.1","main":"index.js"}',
      'node_modules/hps-cli-plugin-b/index.js': 'console.log()',

      // `hps-cli-plugin-b`
      'node_modules/cjs/package.json':
        '{"name":"cjs","version":"0.0.1","main":"index.js"}',
      'node_modules/cjs/index.js': 'module.exports = { data: "cjs" }; ',

      // `esm`
      'node_modules/esm/package.json':
        '{"name":"esm","version":"0.0.1","main":"index.js","type":"module"}',
      'node_modules/esm/index.js': 'export default { data: "esm" };',

      // `esm-2`
      'node_modules/esm-2/package.json':
        '{"name":"esm-2","version":"0.0.1","main":"index.js","type":"module"}',
      'node_modules/esm-2/index.js':
        'export const command = { setup: ()=>"esm-2", name:"esm-2" };',

      // `other`
      'node_modules/other/package.json':
        '{"name":"other","version":"0.0.1","main":"index.js"}',
      'node_modules/other/index.js': 'console.log()',
    });
  });
  afterAll(() => {
    rmSync(fixtureCwd, {
      force: true,
      recursive: true,
    });
  });
  it('Should correct load cli command plugins', async () => {
    const result = await loadCliPlugins(
      ['other', 'esm', 'esm-2', 'cjs'],
      ['@hps/cli-plugin-*/package.json', 'hps-cli-plugin-*/package.json'],
      [fixtureCwd],
      fixtureCwd
    );
    expect(result.length).toBe(1);
    expect(
      result.find((s) => !!~String(s.name).indexOf('@hps/cli-plugin-a'))
    ).toBeUndefined();
    expect(
      result.find((s) => !!~String(s.name).indexOf('hps-cli-plugin-b'))
    ).toBeUndefined();
    const esm2 = result.find((s) => !!~String(s.name).indexOf('esm-2'));
    expect(
      result.find((s) => !!~String(s.name).indexOf('other'))
    ).toBeUndefined();
    expect(esm2?.name).toBe('esm-2');
    expect(
      esm2?.setup({} as any, { logLevel: 2, noColor: false, logger: {} as any })
    ).toBe('esm-2');
    expect(esm2).not.toBeUndefined();
    expect(
      result.find((s) => !!~String(s.name).indexOf('esm'))
    ).not.toBeUndefined();
    expect(
      result.find((s) => !!~String(s.name).indexOf('cjs'))
    ).toBeUndefined();
    expect(
      result.find((s) => !!~String(s.name).indexOf('xxxx'))
    ).toBeUndefined();
  });
});
