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

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
