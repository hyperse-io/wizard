import { resolve } from 'import-meta-resolve';
import { createRequire } from 'node:module';

/**
 * Match `import.meta.resolve` except that `parent` is required (you can pass `import.meta.url`).
 * @param metaUrl `import.meta.url`
 * @param specifier The module specifier to resolve relative to parent
 * @returns The absolute parent module URL to resolve from.
 */
export const requireResolve = (metaUrl: string, specifier: string | URL) => {
  if (specifier instanceof URL) {
    return specifier.toString();
  }
  try {
    // 1. first try to resolve `commonjs`
    return createRequire(metaUrl).resolve(specifier);
  } catch {
    // 2. first try to resolve `esm`
    return resolve(specifier, metaUrl);
  }
};
