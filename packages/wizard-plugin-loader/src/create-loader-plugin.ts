import { definePlugin } from '@hyperse/wizard';
import { loadCliPlugins } from './helpers/helper-load-plugin.js';
import { loaderMessages } from './i18n/messages.js';

export type LoaderPluginOptions = {
  /**
   * The plugin pack pattern to load.
   *
   * @example
   * `['hps-plugin-*\/package.json', '@*\/hps-plugin-*\/package.json', '@hps/plugin-*\/package.json']`
   */
  pluginPackPattern: string[];
  /**
   * The directory search from, it should not include `node_modules`
   */
  pluginSearchDirs: string[];
  /**
   * The directory to begin resolving from
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * The manual load external plugin package names
   *
   * @default []
   */
  plugins?: string[];
};

/**
 * Create a plugin that logs errors to the console.
 * @param options - The options for the plugin.
 * @returns The plugin.
 */
export const createLoaderPlugin = async (options: LoaderPluginOptions) => {
  const {
    plugins = [],
    pluginPackPattern,
    pluginSearchDirs,
    cwd = process.cwd(),
  } = options;
  const cliPlugins = await loadCliPlugins(
    plugins,
    pluginPackPattern,
    pluginSearchDirs,
    cwd
  );
  return definePlugin({
    name: 'plugins.loaderPlugin.name',
    localeMessages: loaderMessages,
    setup: (wizard, ctx) => {
      let cli = wizard;
      for (const plugin of cliPlugins) {
        cli = plugin.setup(cli, ctx);
      }
      return cli;
    },
  });
};
