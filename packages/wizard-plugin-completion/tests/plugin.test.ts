import { existsSync, readFileSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { cliTest } from './test-util.js';

const printer = vi.fn();
const originalPrinter = process.stdout.write;

const getPackageRoot = () => {
  const testFile = fileURLToPath(import.meta.url);
  const testsDir = dirname(testFile);
  return dirname(testsDir);
};

const getFigDir = () => join(getPackageRoot(), '.fig');
const getFigFile = () => join(getFigDir(), 'hps_cli.js');

describe('createCompletionPlugin - completion command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = printer;
    // cleanup generated fig spec if exists
    if (existsSync(getFigDir())) {
      rmSync(getFigDir(), { recursive: true, force: true });
    }
  });

  afterEach(() => {
    process.stdout.write = originalPrinter;
  });

  it('should generate fig spec and print output path by default', async () => {
    await cliTest.parse(['completion']);

    expect(printer).toHaveBeenCalled();
    const firstWrite = printer.mock.calls[0][0];
    // path printed then a new line printed next
    expect(typeof firstWrite).toBe('string');
    expect(firstWrite).toContain('/.fig');

    // newline
    const secondWrite = printer.mock.calls[1]?.[0];
    expect(secondWrite).toBe('\n');

    // file is generated
    expect(existsSync(getFigFile())).toBe(true);
    const content = readFileSync(getFigFile(), 'utf8');
    expect(content).toContain('const hps_cli = ');
    expect(content).toContain('export default hps_cli');
  });

  it('should not output or generate file when --output false is set', async () => {
    await cliTest.parse(['completion', '--output=false']);

    expect(printer).not.toHaveBeenCalled();
    expect(existsSync(getFigDir())).toBe(false);
  });
});
