import type { DeepPartial } from '@hyperse/config-loader';
import {
  mergeOptions,
  searchConfig,
  type UserConfigExport,
} from '@hyperse/config-loader';
import type { ConfigLoaderOptions } from '../types/type-wizard.js';
import { requireResolve } from './helper-require-resolve.js';

/**
 * @description
 * Loads the configuration file and returns the merged configuration object.
 * Typically used to inject configuration context into commands,
 * so configuration is automatically loaded and parsed before command execution.
 *
 * @param projectCwd - The root directory of the project.
 * @param configLoaderOptions - Options for the config loader. Supports custom config file name and loader parameters.
 * @returns The resolved configuration object. Supports object or function (sync/async) default exports.
 */
export const loadConfigFile = async <ConfigOptions extends object>(
  projectCwd: string,
  configLoaderOptions: DeepPartial<ConfigLoaderOptions> = {}
): Promise<DeepPartial<ConfigOptions>> => {
  const finalConfigLoaderOptions = mergeOptions<Required<ConfigLoaderOptions>>(
    {
      configFile: `wizard`,
      loaderOptions: {
        externals: [/^@hyperse\/.*/],
      },
      hiddenLoadSpinner: false,
    },
    configLoaderOptions
  );

  const { configFile, loaderOptions, hiddenLoadSpinner } =
    finalConfigLoaderOptions;

  let spinner;
  if (!hiddenLoadSpinner) {
    const yoctoSpinner = await import('yocto-spinner');
    spinner = yoctoSpinner
      .default({
        text: `Start load ${configFile} configuration...`,
      })
      .start();
  }

  let data;
  try {
    data = await searchConfig<UserConfigExport<DeepPartial<ConfigOptions>>>(
      configFile,
      projectCwd,
      {
        ...loaderOptions,
        projectCwd,
      }
    );
  } catch (error) {
    if (!hiddenLoadSpinner && spinner) {
      spinner.error(`Failed to load ${configFile} configuration`);
    }
    throw new Error(
      `Failed to load configuration file: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  let localData = {};
  if (typeof data?.config === 'function') {
    localData = await data?.config({
      projectCwd,
      resolve: requireResolve,
    });
  } else {
    localData = data?.config || {};
  }
  if (!hiddenLoadSpinner && spinner) {
    spinner.success(
      `The ${configFile} configuration has been loaded successfully!`
    );
  }
  return localData;
};
