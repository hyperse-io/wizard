import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  dts: true,
  entry: ['src/client/index.ts'],
  splitting: false,
  sourcemap: !options.watch,
  clean: true,
  minify: !options.watch,
  treeshake: true,
  format: ['esm'],
}));
