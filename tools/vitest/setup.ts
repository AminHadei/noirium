// oxlint-disable typescript/no-unsafe-member-access
import { beforeAll, afterEach, afterAll } from 'vite-plus/test';

import { server } from '../../src/mocks/node';

import 'virtual:uno.css';

// Pin TZ so date-format assertions are host-agnostic (CI, macOS, etc.).
process.env.TZ = 'UTC';

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class ResizeObserver {
  public observe(): void {}
  public unobserve(): void {}
  public disconnect(): void {}
};

// jsdom lacks IntersectionObserver; embla-carousel and TableOfContents use it.
global.IntersectionObserver ??= class IntersectionObserver {
  public root = null;
  public rootMargin = '';
  public thresholds = [];
  public observe(): void {}
  public unobserve(): void {}
  public disconnect(): void {}
  public takeRecords(): [] {
    return [];
  }
} as unknown as typeof IntersectionObserver;

// jsdom lacks matchMedia; embla-carousel reads it during activation.
if (typeof window !== 'undefined' && window.matchMedia === undefined) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      addListener: (): void => {},
      removeListener: (): void => {},
      dispatchEvent: (): boolean => false,
    }) as unknown as MediaQueryList;
}

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
