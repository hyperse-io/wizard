import { globbySync } from 'globby';
import path from 'path/posix';

/**
 * Find plugins in node_mdoules
 * @param nodeModulesDir directory of search for plugin
 * @param pluginPackPattern ['@*\/hps-cli-plugin-*\/package.json','hps-cli-plugin-*\/package.json', '@hps/cli-plugin-*\/package.json']
 * @returns
 */
export const findPluginsInNodeModules = (
  nodeModulesDir: string,
  pluginPackPattern: string[]
) => {
  const pluginPackageJsonPaths = globbySync(pluginPackPattern, {
    cwd: nodeModulesDir,
    expandDirectories: false,
  });
  return pluginPackageJsonPaths.map((pluginPath) => {
    return path.dirname(pluginPath);
  });
};
