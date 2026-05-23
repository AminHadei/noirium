import type { Plugin } from 'vite-plus';

/**
 * Vite plugin to inject 'vapor' attribute into Vue SFC <script> blocks
 * This is used for the web component build to enable Vue Vapor mode
 */
export function injectVaporAttribute(): Plugin {
  return {
    name: 'inject-vapor-attribute',
    enforce: 'pre',
    transform(
      code: string,
      id: string,
    ): {
      code: string;
      map: null;
    } | null {
      // Only process .vue files
      if (!id.endsWith('.vue')) {
        return null;
      }

      // Check if the file already has vapor attribute
      if (/<script[^>]*\svapor[\s>]/.test(code)) {
        return null;
      }

      // Match <script> blocks and add vapor attribute
      // This regex matches <script setup lang="ts"> or <script setup> or <script lang="ts"> etc.
      const scriptBlockRegex = /(<script\s+(?=[^>]*setup)[^>]*)(>)/g;

      let modified = false;
      const modifiedCode = code.replace(scriptBlockRegex, (_, openingTag, closingBracket) => {
        modified = true;
        // Add vapor attribute before the closing >
        return `${openingTag} vapor${closingBracket}`;
      });

      // Only return modified code if we actually modified something
      if (modified) {
        return {
          code: modifiedCode,
          // We don't need source maps for this simple transformation
          map: null,
        };
      }

      return null;
    },
  };
}
