import { statSync } from 'fs';
import { dirname, join } from 'path/posix';
import { fileURLToPath } from 'url';

export const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

export const isDirectory = (dir: string) => {
  try {
    return statSync(dir).isDirectory();
  } catch {
    return false;
  }
};
