import type { PluginItem } from '../types/type-plugin-item.js';

/**
 * Remove duplicate objects in an array based on a specific key.
 * @param array The array to deduplicate.
 * @param key The key to use for deduplication.
 * @returns The deduplicated array.
 */
export const uniqByKey = (array: PluginItem[], key: keyof PluginItem) => {
  const result: Array<PluginItem> = [];
  const seen = new Set();

  for (const element of array) {
    const value = element[key];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(element);
    }
  }

  return result;
};
