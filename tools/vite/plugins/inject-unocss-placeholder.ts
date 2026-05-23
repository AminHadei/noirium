import { resolve } from 'node:path';

import type { Plugin } from 'vite-plus';

/**
 * Vite plugin to inject @unocss-placeholder into main entry file
 */
export function injectUnoCSSPlaceholder(): Plugin {
  return {
    name: 'inject-unocss-placeholder',
    enforce: 'pre',
    transform(
      code: string,
      id: string,
    ): {
      code: string;
      map: null;
    } | null {
      // Only process main entry file
      if (id !== resolve(__dirname, '../../../src/entries/index.ts')) {
        return null;
      }

      // Check if the file already has virtual:uno.css
      if (code.includes('virtual:uno.css')) {
        return null;
      }

      return {
        code: `import "virtual:uno.css";\n${code}`,
        map: null,
      };
    },
  };
}
