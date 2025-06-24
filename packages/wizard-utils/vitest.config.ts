import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {},
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
