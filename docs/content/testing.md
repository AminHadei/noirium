# Testing

Test setup, conventions, and validated workarounds for `noirium`. For the Storybook side of mocking, see [Storybook & MSW mocking](./storybook-mocking.md).

## Setup

- **Runner:** Vitest, accessed via `vite-plus/test`. Import test utilities from `vite-plus/test`, **not** `vitest`:
  ```ts
  import { describe, it, expect, vi } from 'vite-plus/test';
  ```
- **Component testing:** `@vue/test-utils` v2.
- **Environment:** jsdom. Globals are enabled but explicit imports are preferred.
- **Global setup:** `tools/vitest/setup.ts` starts/stops the MSW server per test file, mocks `ResizeObserver`, and imports `virtual:uno.css`.
- **MSW handlers:** live in each feature's `lib/__mock__/` folder (see [Storybook & MSW mocking](./storybook-mocking.md)) and are aggregated in `src/mocks/node.ts`. Register new handlers there, not inline in tests.
- **Co-location:** tests live next to the component as `<ComponentName>.test.ts`.

## Coverage

V8 provider. Reports: HTML, LCOV, Cobertura, JSON summary.

Exclusions are defined in two places, and a file is exempt only if it matches one of them:

- **Vitest** (`vite.config.ts` → coverage `exclude`): `.stories.ts`, `.test.ts`, `.webc.ts`, `src/entries/**`, `src/mocks/**`, `tools/**`.

If your target file matches neither list, writing tests is required — not optional, not deferred.

## Validated workarounds (the quirks)

These are not derivable from the code — read before writing tests that touch them.

### `onClickOutside` from vueuse v14

Requires **both** a `pointerdown` and a `click` event to trigger the handler. It also requires `attachTo: document.body` when mounting the component under test.

```ts
const wrapper = mount(MyComponent, { attachTo: document.body });
const target = document.body; // outside the component
target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
```

### Child emit → parent propagation in VTU2 with `<script setup>`

`wrapper.emitted()` may not capture events fired via `defineEmits()` when the emit is triggered by calling a vnode prop handler directly — the closure holds the original un-patched function reference.

**Workaround:** pass a `vi.fn()` spy as the relevant `onUpdate:...` prop directly to the mounted component, then assert on the spy:

```ts
const onUpdateModelValue = vi.fn();
const wrapper = mount(DateInput, {
  props: { modelValue: null, 'onUpdate:modelValue': onUpdateModelValue },
});
// trigger emit chain…
expect(onUpdateModelValue).toHaveBeenCalledWith(newDate);
```

### Calling a child vnode prop handler directly

To simulate a child component emitting an event when no DOM trigger exists:

```ts
const datePicker = wrapper.findComponent({ name: 'DatePicker' });
const vnodeProps = (datePicker.vm as any).$.vnode.props ?? {};
const handler = vnodeProps['onUpdate:modelValue'] ?? vnodeProps['onUpdate:model-value'];
handler?.(newDate);
await nextTick();
```

### Mutable closure across `onClickOutside` + template handlers

`let` bindings in `<script setup>` are **not** shared between template event handlers and composable callbacks (closures capture the original reference). Use an object reference when you need mutable state across both:

```ts
const popoverHandle = { close: undefined as (() => void) | undefined };
onClickOutside(containerRef, () => popoverHandle.close?.());
// template:
//   @click="() => { popoverHandle.close = hidePopover; togglePopover(); }"
```

### `vi.mock` with `vi.hoisted`

Variables used inside `vi.mock()` factories must be declared with `vi.hoisted()`:

```ts
const { mockFn } = vi.hoisted(() => ({ mockFn: vi.fn() }));
vi.mock('./Module.vue', async () => {
  // use mockFn here
});
```

## Web-component testing

There is no separate test suite against the built `dist/webc/*.js` files. Instead:

- The **SFC** is unit-tested with Vitest + VTU2 in `<Component>.test.ts` — same as any other component.
- The **wrapper** (`*.webc.ts`) is exercised manually via the playground, Storybook webc stories, and QA snapshot builds.
- Build-script invariants (file count, kebab-case naming, presence of `core.css`) are enforced implicitly by `pnpm build:webc` succeeding.

If you change the wrapper recipe (style injection, prefix logic, custom-element class), validate by running `pnpm build`, opening `dist/webc/<name>.js` in a plain HTML page, and inspecting `adoptedStyleSheets` in DevTools.

## Cheat sheet

```sh
vp test                                         # watch mode
vp test run                                     # one-shot
vp test run src/path/to/Component.test.ts       # single file
vp test run --coverage                          # one-shot with coverage
vp run task:test                                # cached run via task graph
```

## See also

- [Storybook & MSW mocking](./storybook-mocking.md) — per-story handlers + the feature `__mock__` module
- [API patterns](./api-patterns.md) — `ApiService` and runtime config
- [Web components](./web-components.md) — Shadow-DOM mechanics that affect what you can assert
