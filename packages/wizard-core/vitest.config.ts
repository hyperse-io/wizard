import { configDefaults, defineConfig } from 'vitest/config';
import { getDirname } from '../../scripts/getDirname.js';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@hyperse/wizard-utils': getDirname(
        import.meta.url,
        '../wizard-utils/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
