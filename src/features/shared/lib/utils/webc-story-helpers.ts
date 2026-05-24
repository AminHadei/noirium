/**
 * Helpers for web-component (`.webc.ts`) Storybook stories.
 *
 * A webc story renders the *built* custom-element bundle (shadow DOM,
 * adopted stylesheets) rather than the source Vue component — this is the
 * surface we ship to consumers. Bundles are served from `/webc-bundles/*.js`
 * via Storybook's `staticDirs`; run `pnpm build:webc` before opening webc
 * stories.
 */
export interface LoadResult {
  bundleError: string | null;
}

export const loadWebcBundle = async (tag: string, bundleUrl: string): Promise<LoadResult> => {
  if (customElements.get(tag)) return { bundleError: null };
  try {
    await import(/* @vite-ignore */ bundleUrl);
    await customElements.whenDefined(tag);
    return { bundleError: null };
  } catch (error) {
    return {
      bundleError: `Failed to load ${bundleUrl}. Run \`pnpm build:webc\` before opening webc stories. (${String(error)})`,
    };
  }
};

export const renderMissingBundleBanner = (message: string): HTMLElement => {
  const el = document.createElement('div');
  el.style.cssText =
    'padding:1rem;border:2px solid #404040;background:#f5f5f5;color:#262626;font-family:system-ui;border-radius:6px;';
  el.textContent = message;
  return el;
};
