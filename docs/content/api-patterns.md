# API patterns

How the library is configured at runtime by a consumer app, and how HTTP calls are routed. For the test-side mocking story see [Storybook & MSW mocking](./storybook-mocking.md) and [Testing](./testing.md).

## Runtime config facade — `src/config.ts`

Library runtime settings live in `src/config.ts` as a typed `get`/`set` facade over a `ConfigType` shape. Keys: `webComponentPrefix` (default `noirium-`), `apiBaseUrl`, `axiosInstance`, `imageComponent`.

```ts
import { config } from '@/config';

const baseUrl = config.get('apiBaseUrl');
config.set('apiBaseUrl', 'https://api.example.com');
```

Always read via `config.get(...)`; never touch `config.config` directly and never import the raw axios instance. Calling `config.set('apiBaseUrl', url)` transparently rebuilds the shared `axiosInstance` — no other code needs to react.

Consumer apps call `config.set(...)` at bootstrap time before any feature code runs. The web-component prefix override must happen _before_ importing any web component, because `customElements.define` reads the prefix once at module-import time.

## HTTP through `ApiService`

All HTTP calls go through `ApiService.{get,post,put,patch,delete}<T>()` exported from `@/entries/integrations` (defined at `src/features/shared/lib/services/api.service.ts`).

```ts
import { ApiService, isAxiosError, extractApiErrorMessage } from 'noirium/integrations';

try {
  const data = await ApiService.get<Item[]>('/items');
} catch (err) {
  if (isAxiosError(err)) {
    showToast(extractApiErrorMessage(err));
  }
}
```

Key facts:

- `ApiService` wraps `config.get('axiosInstance')`, which is a `redaxios` instance — not full `axios`. Surface area is identical for the methods listed above.
- On failure, every method re-throws as a custom `AxiosError` with `ok`, `data`, and `statusCode` fields.
- Callers narrow with `isAxiosError(err)` and surface user-facing strings via `extractApiErrorMessage(err)`.
- Do not `import axios` or `redaxios` directly in feature code. Always go through `ApiService`.

### Why redaxios

~800 bytes vs ~14 KB for `axios`. The library should not inflate consumer bundles, especially the web-component bundles (each one ships its own copy of every transitive dep). API surface for the methods we use is identical.

## See also

- [Architecture](./architecture.md) — entry layer and where things plug in
- [Storybook & MSW mocking](./storybook-mocking.md) — per-story request handlers
- [Testing](./testing.md) — MSW lifecycle in tests, VTU2 quirks
