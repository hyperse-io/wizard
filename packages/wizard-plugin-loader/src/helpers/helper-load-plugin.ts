import path from 'node:path';
import { pathToFileURL } from 'node:url';
import resolve from 'resolve';
import type { LocaleMessageResolver, Plugin } from '@hyperse/wizard';
import type { PluginItem } from '../types/type-plugin-item.js';
import { findPluginsInNodeModules } from './helper-find-plugins-in-node-modules.js';
import { searchParentDir } from './helper-search-parent-dir.js';
import { uniqByKey } from './helper-uniq-by-key.js';
import { getDirname, isDirectory } from './helper-utils.js';

/**
 * Load plugin from external specificed or auto searched from `pluginSearchDirs`
 * @param plugins The manual load external plugin package names
 * @param pluginPackPattern `['hps-plugin-*\/package.json', '@*\/hps-plugin-*\/package.json', '@hps/plugin-*\/package.json']`
 * @param pluginSearchDirs `The directory search from, it should not include `node_modules`
 * @param cwd The directory to begin resolving from
 * @returns
 */
export const loadCliPlugins = async (
  plugins: string[] = [],
  pluginPackPattern: string[] = [],
  pluginSearchDirs: string[] = [],
  cwd: string = process.cwd()
): Promise<
  Array<{
    name: LocaleMessageResolver;
    setup: Plugin['setup'];
  }>
> => {
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to `commander`
  if (pluginSearchDirs.length === 0) {
    const autoLoadDir = searchParentDir(
      getDirname(import.meta.url),
      'node_modules'
    );
    if (autoLoadDir) {
      pluginSearchDirs = [autoLoadDir];
    }
  }

  const externalPluginNames = plugins.filter(
    (plugin) => typeof plugin === 'string'
  );

  const externalManualLoadPluginInfos = externalPluginNames
    .map((pluginName: string) => {
      let requirePath;
      try {
        // try local files
        requirePath = resolve.sync(path.resolve(cwd, pluginName));
      } catch {
        try {
          // try node modules
          requirePath = resolve.sync(pluginName, { basedir: cwd });
        } catch {
          return undefined;
        }
      }

      return {
        name: pluginName,
        requirePath,
      };
    })
    .filter(Boolean) as Array<PluginItem>;

  const externalAutoLoadPluginInfos = pluginSearchDirs.flatMap(
    (pluginSearchDir: string) => {
      const resolvedPluginSearchDir = path.resolve(cwd, pluginSearchDir);

      const nodeModulesDir = path.resolve(
        resolvedPluginSearchDir,
        'node_modules'
      );

      // In some fringe cases (ex: files "mounted" as virtual directories), the
      // isDirectory(resolvedPluginSearchDir) check might be false even though
      // the node_modules actually exists.
      if (
        !isDirectory(nodeModulesDir) &&
        !isDirectory(resolvedPluginSearchDir)
      ) {
        throw new Error(
          `${pluginSearchDir} does not exist or is not a directory`
        );
      }

      return findPluginsInNodeModules(nodeModulesDir, pluginPackPattern).map(
        (pluginName) => {
          // pluginName : `hps-cli-plugin-a`, `@hps/cli-plugin-b`
          return {
            name: pluginName,
            requirePath: resolve.sync(pluginName, {
              basedir: resolvedPluginSearchDir,
            }),
          };
        }
      );
    }
  );

  const externalPlugins = [
    ...uniqByKey(
      [...externalManualLoadPluginInfos, ...externalAutoLoadPluginInfos],
      'requirePath'
    ),
  ];
  const allPlugins: Array<{
    name: LocaleMessageResolver;
    setup: Plugin['setup'];
  }> = [];
  for (const pluginInfo of externalPlugins) {
    const requirePath = pathToFileURL(pluginInfo.requirePath).href;
    const importModule = await import(requirePath);

    const pluginModule = importModule.default || importModule;
    for (const [, plugin] of Object.entries(pluginModule)) {
      let pluginDefine = plugin as Plugin | (() => Plugin);
      if (typeof pluginDefine == 'function') {
        pluginDefine = pluginDefine();
      }
      const pluginName = pluginDefine.name;
      const setup = pluginDefine.setup;
      // Make sure that we have a plugin name and command module
      if (pluginName && setup) {
        if (allPlugins.find((s) => s.name === pluginName)) {
          console.warn(
            `${pluginInfo.requirePath} has been loaded, duplicate plug-ins are defined? `
          );
        } else {
          allPlugins.push({
            name: pluginName,
            setup: setup,
          });
        }
      }
    }
  }
  return allPlugins;
};
