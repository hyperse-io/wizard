import type { PluginItem } from '../types/type-plugin-item.js';

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
