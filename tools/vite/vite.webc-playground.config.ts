import { resolve } from 'node:path';

import { defineConfig } from 'vite-plus';

const repoRoot = resolve(import.meta.dirname, '../..');

/** Serves playground/webc.html over HTTP so ES module imports from dist/webc work. */
export default defineConfig({
  root: repoRoot,
  server: {
    open: '/playground/webc.html',
  },
});
