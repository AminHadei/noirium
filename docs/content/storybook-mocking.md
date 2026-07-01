# Storybook & MSW mocking

How MSW is wired into Storybook and how to add mock handlers when a component needs network calls. For the test-side MSW lifecycle, see [Testing](./testing.md).

## Storybook + MSW

Storybook is wired to MSW via `msw-storybook-addon`. `tools/storybook/preview.ts` calls `initialize()` and registers `mswLoader` as a global loader.

Stories declare handlers per-story via the `parameters.msw.handlers` array. Do not inline `http.*` handlers in `.stories.ts` files — add a new factory to the feature's `lib/__mock__/index.ts` and call it from the story.

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { http, HttpResponse } from 'msw';
import { PrimaryButton } from '@/features/shared';

const meta = {
  component: PrimaryButton,
  tags: ['autodocs'],
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMockedApi: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/status', () => HttpResponse.json({ ok: true }))],
    },
  },
};
```

## The feature mock module (when you need it)

When a component makes network calls, add `lib/__mock__/index.ts` under its feature exporting:

```ts
// 1. Data factory for story args + test fixtures
export const createItem = (overrides?: Partial<ItemType>): ItemType => ({
  id: 'item_1',
  label: 'Example',
  ...overrides,
});

// 2. Handler factories — each returns an HttpHandler so stories/tests can override per-story
export const itemMocks = {
  getItem: (overrides?: Partial<ItemType>) =>
    http.get('*/items/:id', () => HttpResponse.json(createItem(overrides))),
};

// 3. Handlers array consumed by the global Vitest MSW server
export const itemMockHandlers = Object.values(itemMocks).map((factory) => factory());
```

Register the handlers array in `src/mocks/node.ts` so Vitest picks them up globally:

```ts
import { itemMockHandlers } from '@/features/my-feature/lib/__mock__';

const handlers = [...itemMockHandlers];
export const server = setupServer(...handlers);
```

The kit ships with no default handlers — add them only when you introduce API-backed components.

## Lib + webc Storybook

Storybook is used as a development playground for both the lib and webc builds — no automated tests run inside stories. Each component has a pair of co-located stories:

- `<Component>.stories.ts` — mounts the Vue SFC in lib mode.
- `<Component>.webc.stories.ts` — loads the compiled bundle from `dist/webc/` and mounts the custom element.

Commands:

```sh
pnpm storybook            # interactive Storybook (lib + webc stories both visible)
pnpm build-storybook      # builds webc bundles then produces a static Storybook
```

Storybook config lives at `tools/storybook/`; the webc bundles are served via `staticDirs` mapping `dist/webc` → `/webc-bundles/`. Run `pnpm build:webc` before opening webc stories or they will render a "missing bundle" banner.

Storybook keeps a small sample web-component story for smoke checks. To preview **all** shipped custom elements with real composition and interactions, use the web-component playground:

```sh
pnpm build:webc
pnpm playground:webc
```

Helpers in `src/features/shared/lib/utils/webc-story-helpers.ts`:

- `loadWebcBundle(tag, bundleUrl)` — dynamic-imports the bundle as a Storybook loader. Returns `{ bundleError }` so the story can render a banner instead of crashing when `dist/webc/` is missing.
- `renderMissingBundleBanner(error)` — the banner itself.

Copy an existing `.webc.stories.ts` as the template when adding a new one.

## See also

- [Testing](./testing.md) — MSW server lifecycle in unit tests
- [API patterns](./api-patterns.md) — `ApiService` and runtime config
- [Web components](./web-components.md) — webc story pairing
