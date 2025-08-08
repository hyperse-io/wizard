import { createWizard } from '@hyperse/wizard';
import { createVersionPlugin } from '../src/create-version-plugin.js';

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

  it('should print version with -version flag', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['-version']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should print version with --version flag', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--version']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should print version with -V alias', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['-v']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should print version with version command', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['version']);
    expect(output.join('')).toBe('v1.0.0\n');
  });

  it('should support only command option', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin({ flag: false }));
    await cli.parse(['version']);
    expect(output.join('')).toBe('v1.0.0\n');
    output.length = 0;
    await cli.parse(['--version']);
    expect(output.join('')).toBe('');
  });

  it('should print v prefix if not present', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '2.3.4',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--version']);
    expect(output.join('')).toBe('v2.3.4\n');
  });

  it('should not double v prefix', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => 'v3.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--version']);
    expect(output.join('')).toBe('v3.0.0\n');
  });

  it('should print nothing if version is empty', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--version']);
    expect(output.join('')).toBe('\n');
  });

  it('should support i18n (zh)', async () => {
    process.env.HPS_WIZARD_LOCALE = 'zh';
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: (e) => {
        console.log(e);
      },
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--version']);
    expect(output.join('')).toBe('v1.0.0\n');
    delete process.env.HPS_WIZARD_LOCALE;
  });

  it('should not print version for unrelated flags', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin());
    await cli.parse(['--help']);
    expect(output.join('')).toBe('');
  });

  it('should support hiddenPrefix', async () => {
    const cli = createWizard({
      name: 'cli',
      description: () => 'cli',
      version: () => '1.0.0',
      errorHandler: () => {},
    });
    cli.use(createVersionPlugin({ hiddenPrefix: true }));
    await cli.parse(['--version']);
    expect(output.join('')).toBe('1.0.0\n');
  });
});
