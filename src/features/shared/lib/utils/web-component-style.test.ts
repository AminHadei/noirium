import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

import type { SharedWebComponentStyle } from './web-component-style.util';

function MockCSSStyleSheetWithoutReplaceSync(): void {
  // Intentionally empty mock without replaceSync
}

const createStyles = (): SharedWebComponentStyle[] => [
  { id: 'base', cssText: ':host { color: red; }' },
  { id: 'layout', cssText: ':host { display: block; }' },
];

const getStyleElements = (shadowRoot: ShadowRoot): HTMLStyleElement[] =>
  Array.from(shadowRoot.querySelectorAll('style[data-shared-webc-style]'));

afterEach((): void => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('web-component-style.util (fallback styles)', () => {
  beforeEach((): void => {
    vi.resetModules();
    vi.stubGlobal(
      'CSSStyleSheet',
      MockCSSStyleSheetWithoutReplaceSync as unknown as typeof CSSStyleSheet,
    );
  });

  it('returns early when shadow root is null', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    expect(() => {
      adoptSharedWebComponentStyles(null, [{ id: 'noop', cssText: 'div { color: blue; }' }]);
    }).not.toThrow();
  });

  it('falls back when global ShadowRoot is unavailable', async () => {
    vi.resetModules();
    vi.stubGlobal('ShadowRoot', Reflect.get({}, 'missing') as unknown as typeof ShadowRoot);
    vi.stubGlobal(
      'CSSStyleSheet',
      MockCSSStyleSheetWithoutReplaceSync as unknown as typeof CSSStyleSheet,
    );

    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });

    adoptSharedWebComponentStyles(shadowRoot, [{ id: 'fallback', cssText: ':host{color:#000;}' }]);

    expect(getStyleElements(shadowRoot)).toHaveLength(1);
  });

  it('returns early when styles array is empty', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });

    adoptSharedWebComponentStyles(shadowRoot, []);

    expect(getStyleElements(shadowRoot)).toHaveLength(0);
  });

  it('appends fallback style elements once and avoids duplicates on repeat calls', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const styles = createStyles();

    adoptSharedWebComponentStyles(shadowRoot, styles);
    expect(getStyleElements(shadowRoot)).toHaveLength(2);

    adoptSharedWebComponentStyles(shadowRoot, styles);
    expect(getStyleElements(shadowRoot)).toHaveLength(2);
  });

  it('reuses fallback template cache across different shadow roots', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const styles = createStyles();
    const firstHost = document.createElement('div');
    const secondHost = document.createElement('div');
    const firstShadowRoot = firstHost.attachShadow({ mode: 'open' });
    const secondShadowRoot = secondHost.attachShadow({ mode: 'open' });

    adoptSharedWebComponentStyles(firstShadowRoot, styles);
    adoptSharedWebComponentStyles(secondShadowRoot, styles);

    expect(getStyleElements(firstShadowRoot)).toHaveLength(2);
    expect(getStyleElements(secondShadowRoot)).toHaveLength(2);
  });

  it('handles iterable cssText entries with undefined codePoint values', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const cssTextWithEmptyChunk = {
      *[Symbol.iterator](): Generator<string, void, unknown> {
        yield '';
      },
      toString(): string {
        return '';
      },
    } as unknown as string;

    adoptSharedWebComponentStyles(shadowRoot, [{ id: 'iterable', cssText: cssTextWithEmptyChunk }]);

    expect(getStyleElements(shadowRoot)).toHaveLength(1);
  });
});

describe('web-component-style.util (constructable stylesheets)', () => {
  class MockShadowRoot {}
  Object.defineProperty(MockShadowRoot.prototype, 'adoptedStyleSheets', {
    value: [],
    writable: true,
    configurable: true,
  });

  class MockCSSStyleSheet {
    public cssText = '';

    public replaceSync(cssText: string): void {
      this.cssText = cssText;
    }
  }

  beforeEach((): void => {
    vi.resetModules();
    vi.stubGlobal('ShadowRoot', MockShadowRoot as unknown as typeof ShadowRoot);
    vi.stubGlobal('CSSStyleSheet', MockCSSStyleSheet as unknown as typeof CSSStyleSheet);
  });

  it('adopts constructable stylesheets and avoids duplicates', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const styles = createStyles();

    const shadowRoot = {
      adoptedStyleSheets: [] as CSSStyleSheet[],
    } as unknown as ShadowRoot;

    adoptSharedWebComponentStyles(shadowRoot, styles);
    expect(shadowRoot.adoptedStyleSheets).toHaveLength(2);

    adoptSharedWebComponentStyles(shadowRoot, styles);
    expect(shadowRoot.adoptedStyleSheets).toHaveLength(2);
  });

  it('reuses cached stylesheet instances across different shadow roots', async () => {
    const { adoptSharedWebComponentStyles } = await import('./web-component-style.util');
    const styles = createStyles();

    const firstShadowRoot = {
      adoptedStyleSheets: [] as CSSStyleSheet[],
    } as unknown as ShadowRoot;
    const secondShadowRoot = {
      adoptedStyleSheets: [] as CSSStyleSheet[],
    } as unknown as ShadowRoot;

    adoptSharedWebComponentStyles(firstShadowRoot, styles);
    adoptSharedWebComponentStyles(secondShadowRoot, styles);

    expect(secondShadowRoot.adoptedStyleSheets[0]).toBe(firstShadowRoot.adoptedStyleSheets[0]);
    expect(secondShadowRoot.adoptedStyleSheets[1]).toBe(firstShadowRoot.adoptedStyleSheets[1]);
  });
});
