import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { existsSync, realpathSync } from 'node:fs';

function resolveFile(file: string) {
  const path = realpathSync(process.cwd());
  return `${path}/${file}`;
}

/**
 * @description
 * Loads and expands environment variable files (.env),
 * Supporting dynamic loading of different .env files based on the provided env and envPath parameters.
 *
 * @param flags Contains env (the environment variable key) and optional envPath (custom .env file path).
 */
export const loadDotenv = (flags: { env: string; envPath?: string }) => {
  const { env: envKey, envPath } = flags;
  const envVal = process.env[envKey] ?? '';

  const dotenvFiles = [
    resolveFile(`.env.${envVal}`),
    resolveFile('.env.local'),
    resolveFile('.env'),
  ].filter(Boolean);

  if (envPath) {
    dotenvFiles.unshift(resolveFile(envPath));
  }

  dotenvFiles.forEach((dotenvFile) => {
    if (existsSync(dotenvFile)) {
      dotenvExpand.expand(
        dotenv.config({
          path: dotenvFile,
        })
      );
    }
  });
};
