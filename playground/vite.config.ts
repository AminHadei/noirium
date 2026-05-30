import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import unoCSS from 'unocss/vite';
import { defineConfig } from 'vite-plus';

const __dirname = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), unoCSS({ configFile: resolve(__dirname, './uno.config.ts') })],
});
