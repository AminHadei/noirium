// oxlint-disable no-console
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { build, type Plugin } from 'vite-plus';

const currentDir = import.meta.dirname;
const distDir = resolve(currentDir, '../../dist/webc');
const coreStylesPath = resolve(currentDir, '../../dist/lib/core.css');

const VIRTUAL_ID = 'virtual:core-styles';
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

function coreStylesPlugin(): Plugin {
  return {
    name: 'core-styles',
    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
      return null;
    },
    async load(id: string) {
      if (id === RESOLVED_VIRTUAL_ID) {
        const css = await readFile(coreStylesPath, 'utf-8');
        return `export default ${JSON.stringify(css)};`;
      }
      return null;
    },
  };
}

async function getWebComponentEntries(): Promise<Record<string, string>> {
  const featuresDir = resolve(currentDir, '../../src/features');
  const entries: Record<string, string> = {};

  async function findWebcFiles(dir: string): Promise<void> {
    try {
      const items = await readdir(dir, { withFileTypes: true });
      const subdirPromises: Promise<void>[] = [];

      for (const item of items) {
        const fullPath = resolve(dir, item.name);
        if (item.isDirectory()) {
          subdirPromises.push(findWebcFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.webc.ts')) {
          const componentName = item.name.replace('.webc.ts', '');
          const kebabName = componentName
            .replaceAll(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '');
          entries[kebabName] = fullPath;
        }
      }

      await Promise.all(subdirPromises);
    } catch {
      // Directory might not exist, skip silently
    }
  }

  await findWebcFiles(featuresDir);
  return entries;
}

const buildCompatBundle = async (entryName: string, entryFile: string): Promise<void> => {
  await build({
    configFile: false,
    plugins: [coreStylesPlugin(), vue({ customElement: true }), UnoCSS({ mode: 'global' })],
    resolve: {
      alias: {
        '@popperjs/core': '@popperjs/core/dist/umd/popper.js',
        '@': resolve(currentDir, '../../src'),
      },
    },
    define: {
      'import.meta.env.VITE_BASE_URL': "''",
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
      copyPublicDir: false,
      minify: 'terser',
      lib: {
        entry: entryFile,
        formats: ['es'],
        fileName: () => `${entryName}.js`,
      },
      rolldownOptions: {
        output: {
          chunkFileNames: 'chunks/chunk-[hash].js',
          assetFileNames: 'assets/[hash][extname]',
        },
        experimental: {
          lazyBarrel: true,
        },
      },
      outDir: distDir,
      emptyOutDir: false,
      cssCodeSplit: false,
    },
  });
};

const ensureCoreStyles = (): void => {
  if (existsSync(coreStylesPath)) return;

  console.log('[build:webc] core.css not found — running build:lib first...');
  execSync('vp build -c tools/vite/vite.lib.config.ts', {
    cwd: resolve(currentDir, '../..'),
    stdio: 'inherit',
  });

  if (!existsSync(coreStylesPath)) {
    throw new Error(`build:lib completed but ${coreStylesPath} was not produced.`);
  }
};

const main = async (): Promise<void> => {
  ensureCoreStyles();

  const entries = await getWebComponentEntries();
  const sortedEntries = Object.entries(entries).toSorted(([a], [b]) => a.localeCompare(b));

  await rm(distDir, { recursive: true, force: true });

  await Promise.all(
    // oxlint-disable-next-line typescript/promise-function-async
    sortedEntries.map(([entryName, entryFile]) => buildCompatBundle(entryName, entryFile)),
  );

  // post build commands - clean up unnecessary files
  await rm(resolve(distDir, 'assets'), { recursive: true });
};

await main();
