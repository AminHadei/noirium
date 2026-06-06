import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import unoCSS from 'unocss/vite';
import dts from 'vite-plugin-dts';
import { defineConfig, mergeConfig } from 'vite-plus';

import { injectUnoCSSPlaceholder } from './plugins/inject-unocss-placeholder';
import sharedConfig from './vite.shared.config';

// Build configuration for Vue 3 component library
export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [
      injectUnoCSSPlaceholder(),
      vue(),
      unoCSS(),
      dts({
        tsconfigPath: resolve(__dirname, '../../tsconfig.json'),
        outDirs: [resolve(__dirname, '../../dist/types')],
        exclude: ['**/*.stories.*', '**/*.test.*', 'vitest.config.ts', 'tools/**/*'],
      }),
    ],
    build: {
      minify: 'esbuild',
      lib: {
        entry: {
          core: resolve(__dirname, '../../src/entries/index.ts'),
          ui: resolve(__dirname, '../../src/entries/ui.ts'),
          integrations: resolve(__dirname, '../../src/entries/integrations.ts'),
          utils: resolve(__dirname, '../../src/entries/utils.ts'),
          types: resolve(__dirname, '../../src/entries/types.ts'),
        },
        name: 'Noirium',
        // Vite 8+ defaults CSS output to package name (noirium.css); keep core.css for the public API.
        cssFileName: 'core',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          const ext = format === 'es' ? 'mjs' : 'cjs';
          return `${entryName}.${ext}`;
        },
      },
      rollupOptions: {
        // Externalize dependencies that shouldn't be bundled
        external: ['vue'],
        output: {
          exports: 'named',
          preserveModules: false,
          inlineDynamicImports: false,
          manualChunks: () => 'core',
          globals: {
            vue: 'Vue',
          },
        },
      },
      outDir: 'dist/lib',
      emptyOutDir: true,
    },
  }),
);
