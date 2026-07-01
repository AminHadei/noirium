import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import unoCSS from 'unocss/vite';
import { defineConfig } from 'vite-plus';

const repoRoot = resolve(import.meta.dirname, '..');
const builtCss = resolve(repoRoot, 'dist/lib/core.css');

export default defineConfig({
  root: import.meta.dirname,
  plugins: [vue(), unoCSS({ configFile: resolve(repoRoot, 'uno.config.ts') })],
  resolve: {
    alias: {
      '@': resolve(repoRoot, 'src'),
      'noirium/ui': resolve(repoRoot, 'src/entries/ui.ts'),
      ...(existsSync(builtCss) ? { 'noirium/style.css': builtCss } : {}),
    },
  },
});
