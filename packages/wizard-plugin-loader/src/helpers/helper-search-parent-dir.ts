import { existsSync } from 'node:fs';
import { join } from 'node:path/posix';

const splitPath = (path: string) => {
  const parts = path.split(/(\/|\\)/);
  if (!parts.length) return parts;

  // when path starts with a slash, the first part is empty string
  return !parts[0].length ? parts.slice(1) : parts;
};

/**
 * Finds the first parent directory that contains a given file or directory.
 * @param currentFullPath Directory search start
 * @param clue Give file or directory we want to find.
 * @returns
 */
export const searchParentDir = (currentFullPath: string, clue: string) => {
  function testDir(parts: string[]): string | null {
    if (parts.length === 0) {
      return null;
    }
    const p: string = parts.join('');
    const itdoes = existsSync(join(p, clue));
    return itdoes ? p : testDir(parts.slice(0, -1));
  }
  return testDir(splitPath(currentFullPath));
};
