import { createWizard, defineCommand, definePlugin } from '@hyperse/wizard';
import { createHelpPlugin } from '../src/create-help-plugin.js';

// Mock process.stdout.write to capture output
const mockStdoutWrite = vi.fn();
const originalStdoutWrite = process.stdout.write;

describe('createHelpPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = mockStdoutWrite;
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
  });

  describe('basic functionality', () => {
    it('should create help plugin with default options', () => {
      const plugin = createHelpPlugin();
      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('plugins.helpPlugin.name');
      expect(plugin.localeMessages).toBeDefined();
    });

    it('should create help plugin with custom options', () => {
      const options = {
        flag: false,
        banner: () => 'Custom Banner',
        footer: () => 'Custom Footer',
      };
      const plugin = createHelpPlugin(options);
      expect(plugin).toBeDefined();
    });
  });

  describe('help flag functionality', () => {
    it('should register help flag by default', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin());
      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('test-cli');
    });

    it('should register help flag with alias -h', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin());
      await cli.parse(['-h']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('test-cli');
    });

    it('should not register help flag when flag option is false', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin({ flag: false }));

      // Should not throw error when help flag is not registered
      expect(async () => {
        await cli.parse(['--help']);
      }).not.toThrow();
    });

    it('should display banner when provided in help flag', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      const banner = '🎉 Custom Banner 🎉';
      cli.use(
        createHelpPlugin({
          showBanner: true,
          overrideLocaleMessages: {
            en: {
              helpPlugin: {
                banner: banner,
              },
            },
          },
        })
      );
      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain(banner);
    });

    it('should display footer when provided in help flag', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      const footer = '© 2025 Custom Footer';
      cli.use(
        createHelpPlugin({
          showFooter: true,
          overrideLocaleMessages: {
            en: {
              helpPlugin: {
                footer: footer,
              },
            },
          },
        })
      );
      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain(footer);
    });
  });

  describe('with global flags', () => {
    it('should display global flags in help', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin());
      cli.flag('verbose', {
        type: Boolean,
        default: false,
        description: () => 'Enable verbose output',
        alias: 'v',
      });

      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('verbose');
      expect(output).toContain('Enable verbose output');
    });

    it('should display multiple global flags in help', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin());
      cli.flag('verbose', {
        type: Boolean,
        default: false,
        description: () => 'Enable verbose output',
        alias: 'v',
      });
      cli.flag('debug', {
        type: Boolean,
        default: false,
        description: () => 'Enable debug mode',
        alias: 'd',
      });

      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('verbose');
      expect(output).toContain('debug');
    });
  });

  describe('complex CLI structure', () => {
    it('should handle complex CLI with multiple commands and flags', async () => {
      const evolve = defineCommand('evolve', {
        description: () => 'Evolve description',
      }).flags({
        evolveName: {
          type: String,
          default: 'evolveName',
          description: () => 'Evolve name',
        },
      });

      const migrate = defineCommand('migrate', {
        description: () => 'Migrate description',
      }).flags({
        migrateName: {
          type: String,
          default: 'migrateName',
          description: () => 'Migrate name',
        },
      });

      const cli = createWizard({
        name: 'complex-cli',
        description: () => 'Complex CLI for testing',
        version: () => '1.0.0',
      });

      cli.use(
        createHelpPlugin({
          showBanner: true,
          showFooter: true,
          overrideLocaleMessages: {
            en: {
              helpPlugin: {
                banner: '🎉 Complex CLI Banner 🎉',
                footer: '© 2025 Complex CLI Footer',
              },
            },
          },
        })
      );

      cli.use(
        definePlugin({
          name: () => 'test plugin',
          setup: (wizard) => {
            return wizard.register(
              defineCommand('build', {
                description: () => 'Build command',
                example: () =>
                  'build --projectCwd ./project --type --timeout 1000',
              })
                .flags({
                  projectCwd: {
                    type: String,
                    default: 'projectCwd',
                    description: () => 'Project CWD',
                  },
                  type: {
                    type: Boolean,
                    default: true,
                    description: () => 'Type flag',
                  },
                  timeout: {
                    type: Number,
                    description: () => 'Timeout value',
                  },
                })
                .use(evolve, migrate)
            );
          },
        })
      );

      cli.flag('version1', {
        type: Boolean,
        default: true,
        alias: 'a',
        description: () => 'Version 1 flag',
      });

      cli.flag('version2', {
        type: Number,
        default: 1,
        alias: 'b',
        description: () => 'Version 2 flag',
      });

      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];

      // Check banner and footer
      expect(output).toContain('🎉 Complex CLI Banner 🎉');
      expect(output).toContain('© 2025 Complex CLI Footer');

      // Check CLI name
      expect(output).toContain('complex-cli');

      // Check global flags
      expect(output).toContain('version1');
      expect(output).toContain('version2');
    });
  });

  describe('help flag behavior', () => {
    it('should show help and exit when help flag is true', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(createHelpPlugin());

      // Add a command that should not execute when help flag is used
      const testCommand = defineCommand('test', {
        description: () => 'Test command',
      }).process(() => {
        throw new Error('This should not execute');
      });

      cli.use(
        definePlugin({
          name: () => 'test plugin',
          setup: (wizard) => {
            return wizard.register(testCommand);
          },
        })
      );

      // Should not throw error because help flag process should prevent execution
      await cli.parse(['test', '--help']);
      expect(mockStdoutWrite).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty banner and footer', async () => {
      const cli = createWizard({
        name: 'test-cli',
        description: () => 'Test CLI',
        version: () => '1.0.0',
      });

      cli.use(
        createHelpPlugin({
          showBanner: false,
          showFooter: false,
        })
      );
      await cli.parse(['--help']);

      expect(mockStdoutWrite).toHaveBeenCalled();
      const output = mockStdoutWrite.mock.calls[0][0];
      expect(output).toContain('test-cli');
    });
  });
});
