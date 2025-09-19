import { configDefaults, defineConfig } from 'vitest/config';
import { getDirname } from '../../scripts/getDirname.js';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@hyperse/wizard': getDirname(import.meta.url, '../wizard/src/index.ts'),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude],
    testTimeout: 5000 * 1000,
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
