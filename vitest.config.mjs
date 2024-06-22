import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    setupFiles: ['./setupVitest.ts']
  },
  plugins: [swc.vite(), tsconfigPaths()]
});
