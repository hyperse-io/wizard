import { vi } from 'vitest';
import { createWizard } from '@hyperse/wizard-core';
import { createVersionPlugin } from '../src/create-version-plugin.js';
import { sleep } from './utils/test-utils.js';

describe('version plugin', () => {
  let stdoutWriteSpy: any;
  let output: string[];

  beforeEach(() => {
    output = [];
    stdoutWriteSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation((str: any) => {
        output.push(typeof str === 'string' ? str : String(str));
        return true;
      });
  });

  afterEach(() => {
    stdoutWriteSpy?.mockRestore();
  });

  it('should print version with -version flag', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['-version']);
    expect(output.length).toBe(0);
  });

  it('should print version with --version flag', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['--version']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should print version with -V alias', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['-V']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should print version with version command', async () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['version']);
    await sleep();
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should support only command option', async () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin({ flag: false }));
    cli.parse(['version']);
    await sleep();
    expect(output.join('')).toBe('v1.0.0\n');
    output.length = 0;
    cli.parse(['--version']);
    expect(output.join('')).toBe('');
  });

  it('should print v prefix if not present', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '2.3.4',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['--version']);
    expect(output.join('')).toBe('v2.3.4\n');
  });

  it('should not double v prefix', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => 'v3.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['--version']);
    expect(output.join('')).toBe('v3.0.0\n');
  });

  it('should print nothing if version is empty', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['--version']);
    expect(output.join('')).toBe('\n');
  });

  it('should support i18n (zh)', () => {
    process.env.HPS_WIZARD_LOCALE = 'zh';
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: (e) => {
        console.log(e);
      },
    });
    cli.use(createVersionPlugin());
    cli.parse(['--version']);
    expect(output.join('')).toBe('v1.0.0\n');
    delete process.env.HPS_WIZARD_LOCALE;
  });

  it('should not print version for unrelated flags', () => {
    const cli = createWizard({
      name: 'cli',
      description: 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    cli.parse(['--help']);
    expect(output.join('')).toBe('');
  });
});
