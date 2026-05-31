# Web Components — Developer Wiki

> Everything you need to know to author, build, debug, and ship the Shadow-DOM-isolated custom elements that `noirium` exports alongside its Vue library.

This is the **deep guide** for the dual-build (Vue library + Web Components). Architecture overview is in [Architecture](./architecture.md); component-authoring conventions are in [Components](./components.md); styling mechanics are in [Styling](./styling.md).

---

## Table of contents

1. [Why two distributions](#why-two-distributions)
2. [Mental model: lib vs. webc](#mental-model-lib-vs-webc)
3. [Authoring a new web component](#authoring-a-new-web-component)
4. [The build pipeline](#the-build-pipeline)
5. [Style isolation deep-dive](#style-isolation-deep-dive)
6. [Teleport, portals, and overlays](#teleport-portals-and-overlays)
7. [Popper / floating UI in Shadow DOM](#popper--floating-ui-in-shadow-dom)
8. [Naming, prefixing, and registration](#naming-prefixing-and-registration)
9. [Consuming a web component](#consuming-a-web-component)
10. [Testing web components](#testing-web-components)
11. [Performance & bundle size](#performance--bundle-size)
12. [Dual-build pitfalls (the bug catalog)](#dual-build-pitfalls-the-bug-catalog)
13. [Troubleshooting](#troubleshooting)
14. [Cheat sheet](#cheat-sheet)

---

## Why two distributions

`noirium` ships **one** source tree but **two** built artifacts:

| Distribution       | Output                                               | Consumer                                                    | When to use                                                               |
| ------------------ | ---------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Vue library**    | `dist/lib/*.{mjs,cjs}` + `dist/lib/core.css`         | Vue 3 host apps with their own bundler                      | First-class integration, full Vue reactivity, shared theme/CSS            |
| **Web Components** | `dist/webc/<kebab-name>.js` (one file per component) | Any HTML page — no bundler, no framework, even non-Vue apps | Embed a single feature inside a Rails / Django / WordPress / vanilla page |

The dual output is **fundamental**. A change that works in the library build can silently break the web-component build (and vice versa). Always test both when touching shared code.

---

## Mental model: lib vs. webc

Holding both in your head while writing a component:

| Aspect                                               | Library build                              | Web-component build                                                                                        |
| ---------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Bundle                                               | One package shared across all components   | **Self-contained per component** (`primary-button.js` ships its own copy of Vue runtime, deps, and styles) |
| Vue runtime                                          | `vue` is **externalized** (peer dep)       | Vue runtime is **bundled in**                                                                              |
| CSS scope                                            | Global — host app imports `style.css` once | **Shadow DOM** — each element's styles are isolated                                                        |
| Global CSS                                           | Inherited from host app                    | **Does not cross the shadow boundary**                                                                     |
| `document.body`                                      | Real `<body>` of the host page             | Lives outside the shadow root — DOM queries jump out of scope                                              |
| Teleport target                                      | `body` is fine                             | Must be the **shadow root**, otherwise overlays escape and lose styles                                     |
| Popper offset parent                                 | The first positioned ancestor              | The **shadow host** — `position: absolute` lands in the wrong place                                        |
| Bundler-style imports (bare specifiers, lazy chunks) | Resolved by host app                       | Must be resolvable at build time by our own bundler                                                        |
| Cost of a new dependency                             | Adds it once to the lib bundle             | Adds it to **every** webc that transitively pulls it in                                                    |

> **Rule of thumb when editing shared code:** ask "what changes for the bundle when CSS/styles/positioning is involved?" If you can answer in webc-mode, you're safe.

---

## Authoring a new web component

The recipe is **fixed**. Don't improvise — copy from [PrimaryButton.webc.ts](../../src/features/shared/components/PrimaryButton/PrimaryButton.webc.ts) and edit.

### File location & naming

- Live next to the SFC: `src/features/<feature>/components/<Name>/<Name>.webc.ts`.
- The build script auto-discovers `*.webc.ts` recursively under `src/features/`.
- The output filename is computed from the component name: `PrimaryButton.webc.ts` → `dist/webc/primary-button.js`.

### The recipe

```ts
import styles from 'virtual:core-styles';
import { defineCustomElement } from 'vue';

import { config } from '@/config';
import { PrimaryButton } from '@/features/shared';
import { adoptSharedWebComponentStyles } from '@/features/shared/lib/utils/web-component-style.util';

import resetTailwind from '@unocss/reset/tailwind.css?raw';

const sharedStyles = [
  { id: 'tailwind-reset', cssText: resetTailwind.replaceAll(':root', `:host`) },
  { id: 'core-style', cssText: styles.replaceAll(':root', `:host`) },
];

const PrimaryButtonElementBase = defineCustomElement(PrimaryButton);

class PrimaryButtonElement extends PrimaryButtonElementBase {
  override connectedCallback(): void {
    super.connectedCallback();
    adoptSharedWebComponentStyles(this.shadowRoot, sharedStyles);
  }
}

customElements.define(`${config.get('webComponentPrefix')}primary-button`, PrimaryButtonElement);
```

### What each line is doing

1. **`virtual:core-styles`** — virtual module exposing the compiled `dist/lib/core.css` as a string. Defined in `tools/vite/build-webc.ts` via the `coreStylesPlugin`. **Requires `pnpm build:lib` to have run first.**
2. **`@unocss/reset/tailwind.css?raw`** — the Tailwind reset, imported as a raw string. Both stylesheets are rewritten so `:root` selectors apply to the **`:host`** of the custom element (which is the closest equivalent to `:root` inside a shadow root).
3. **`defineCustomElement(PrimaryButton)`** — Vue's helper that wraps an SFC into a `CustomElementConstructor`.
4. **Subclass + `connectedCallback`** — we extend the generated element so we can run `adoptSharedWebComponentStyles` after Vue has set up the shadow root. **Don't hand-roll `<style>` injection** — always go through the util.
5. **`customElements.define(prefix + name, ElementClass)`** — `prefix` comes from `config.get('webComponentPrefix')`. Default is `noirium-` (see [`src/config.ts`](../../src/config.ts)). Consumers can override the prefix at runtime if they need to disambiguate.

### Required steps after creating a `.webc.ts`

1. Make sure the SFC is exported from the feature's `index.ts` (you import via `@/features/...`, not deep paths).
2. Add an entry under `package.json` exports if you want a stable subpath (`./web-components/<kebab-name>` is the established pattern — auto-resolved via the wildcard in `exports`).
3. Run `pnpm build` (lib **then** webc — the order matters, see below).
4. Confirm `dist/webc/<kebab-name>.js` exists and is sane in size.
5. Smoke-test in the playground or a plain HTML page (see [Consuming a web component](#consuming-a-web-component)).
6. Add a changeset (this is a new public export — `minor`).

---

## The build pipeline

### `pnpm build` = `pnpm build:lib && pnpm build:webc`

The lib build **must run first**. The webc build reads `dist/lib/core.css` to bundle styles into each shadow root via the `virtual:core-styles` virtual module. If you skipped `build:lib`, every webc will either fail to build or ship without core styles.

### Library build — `tools/vite/vite.lib.config.ts`

- Multi-entry library mode (one entry per `package.json` subpath export).
- Emits ESM (`.mjs`) and CJS (`.cjs`) to `dist/lib/`.
- Types emitted to `dist/types/` via `vite-plugin-dts`.
- Externalized peer dep: `vue`. Do not bundle it.

### Web-component build — `tools/vite/build-webc.ts`

A custom Node.js script (not a vite config file). Key behaviors:

| Behavior                                                           | Why                                                                                                                                                                          |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recursively scans `src/features/**/*.webc.ts`                      | Auto-discovery — no manual entry list to maintain                                                                                                                            |
| `PascalCase.webc.ts` → `kebab-case.js`                             | Filename normalization for consumer URLs                                                                                                                                     |
| **Aliases `@popperjs/core` → `@popperjs/core/dist/umd/popper.js`** | The ESM build has a **Rollup scope-hoisting bug** that breaks inside the self-contained webc bundle. **Do not change this without re-testing every popper-based component.** |
| Injects Tailwind reset + UnoCSS via `virtual:core-styles` plugin   | Each component's shadow DOM ships its own copy of the reset + utilities                                                                                                      |
| Vue plugin runs in `customElement: true` mode                      | Compiles SFCs for `defineCustomElement`                                                                                                                                      |
| UnoCSS plugin runs in `mode: 'global'`                             | Pulls in any utility classes referenced in the bundled SFCs                                                                                                                  |
| Terser-minified, chunks split into `dist/webc/chunks/`             | Shared code across components is deduped at the chunk level                                                                                                                  |
| One bundle per `.webc.ts` entry                                    | Lets consumers cherry-pick by filename                                                                                                                                       |

### CDN deployment

On every tagged release, `tools/ci/publish-webc.ts` can upload `dist/webc/` to your CDN at `noirium/webc/v<version>/`. Snapshot builds upload to `…/v0.0.0-mr-<MR_IID>-<short-sha>/` so QA can load them by URL without an npm install.

---

## Style isolation deep-dive

### The shadow boundary

Every component built via `defineCustomElement` lives in **closed-ish** shadow DOM. Consequences:

- Global styles from the host page **do not** leak in.
- Styles defined inside the component **do not** leak out.
- `:root` doesn't exist; the analog is `:host`.
- `document.querySelector` from outside cannot see internals.
- CSS variables **do** inherit through `:host` (so `--primary-color` on `:root` of the host page reaches inside, if you opt in).

### How styles get inside

```
dist/lib/core.css                ─┐
@unocss/reset/tailwind.css?raw   ─┼──► virtual:core-styles
                                  │       │
                                  │       ▼
                                  │   sharedStyles (id + cssText)
                                  │       │
                                  │       ▼
                                  └─► adoptSharedWebComponentStyles(shadowRoot, sharedStyles)
                                          │
                                ┌─────────┴─────────┐
                                ▼                   ▼
                  Constructable Stylesheets    Fallback <style> tags
                  (modern browsers)            (older browsers)
```

The util ([web-component-style.util.ts](../../src/features/shared/lib/utils/web-component-style.util.ts)) does three important things:

1. **Caches** stylesheets by content hash so 100 instances of `<noirium-primary-button>` share **one** `CSSStyleSheet` object, not 100 copies.
2. **Detects** Constructable Stylesheets support (`adoptedStyleSheets` + `replaceSync`). Falls back to cloned `<style>` elements where unsupported.
3. **Idempotent** — calling it multiple times in the same shadow root won't duplicate.

**Never replace this with hand-rolled `<style>` injection** — you'll lose the cache, balloon memory, and break perf with many instances.

### Why `:root` → `:host` rewriting

`@unocss/reset/tailwind.css` and our compiled `core.css` use `:root` for CSS variables and base styles. Inside shadow DOM, `:root` matches the document root **outside** the shadow tree, which is wrong (or worse, invisible). `replaceAll(':root', ':host')` re-targets those declarations to the custom element host.

### Component-scoped styles in SFCs

Inside a `.vue` file:

- `<style>` and `<style scoped>` get inlined into the shadow root by Vue automatically.
- UnoCSS utilities used in `<template>` are extracted at build time and end up in `dist/lib/core.css` — which is **also** injected into every shadow root.
- The `:uno:` class-transformer prefix (see [Styling](./styling.md)) compacts utility lists into a single class name. Use it inside `<template>` of components destined for webc to keep bundle CSS lean.

### What does **not** cross the boundary

| Style source                                           | Reaches inside webc?                                 |
| ------------------------------------------------------ | ---------------------------------------------------- |
| Host page's global stylesheet                          | ❌                                                   |
| Host page's CSS-in-JS (Tailwind in the host app, etc.) | ❌                                                   |
| `:root` CSS variables                                  | ✅ (inherited through `:host`)                       |
| Fonts loaded in the host page                          | ✅ (font loading is document-scoped)                 |
| `@font-face` declared inside the shadow root           | ❌ Doesn't apply; declare fonts in the host document |

**Practical consequence:** if you depend on a custom font, the host page must load the `@font-face`. We document this in the consumer-facing snippet.

---

## Teleport, portals, and overlays

### The hard rule

> **NEVER** write `<Teleport to="body">` (or any hardcoded string target) in a component that ships as a web component.

Teleporting to `body` from inside a shadow root sends the teleported subtree **out of the shadow DOM** — at which point it loses every style we just injected and the user sees an unstyled overlay floating in the host page.

### The fix: `useTeleportTarget`

Use the composable in [src/features/shared/composables/useTeleportTarget.ts](../../src/features/shared/composables/useTeleportTarget.ts):

```vue
<script setup lang="ts">
  import { useTeleportTarget } from '@/features/shared';

  const teleportTarget = useTeleportTarget(); // defaults to 'body'
</script>

<template>
  <Teleport :to="teleportTarget">
    <div class="overlay">…</div>
  </Teleport>
</template>
```

Behavior:

- In **library mode** → returns `'body'`. Same as before.
- In **web-component mode** → on mount, walks `getRootNode()`; if it's a `ShadowRoot`, returns that node directly. The teleported subtree stays inside the shadow tree and keeps its styles.

### Review-time check

Any `<Teleport>` with a static `to` attribute in a file that has a `.webc.ts` sibling (or is imported by one) is a **review-blocker**. The `/review` skill flags these automatically.

---

## Popper / floating UI in Shadow DOM

### The problem

Popper.js positions floating elements relative to their **offset parent**. Inside shadow DOM, the offset parent of a `position: absolute` child is the **shadow host element**, not the document — so `top: 0; left: 0` lands on the host element's coordinate system, not the viewport's.

### The fix

Pass `positionFixed: true` (which forces `strategy: 'fixed'` in Popper). This switches positioning to the viewport, which behaves identically inside or outside shadow DOM.

In this repo, `DatePicker` always sets `positionFixed: true` for v-calendar's popover options. We extended `PopoverOptions` locally in [src/features/shared/lib/types.ts](../../src/features/shared/lib/types.ts) because the upstream type was missing the field.

### Other components touched by this rule

Anything that opens a floating UI — `BaseDropdown`, `DatePicker`, `Toast`, `BaseDialog`. When you add a new dropdown/tooltip-like component, set `positionFixed: true` from day one.

### The Popper aliasing in `build-webc.ts`

The `@popperjs/core` ESM build hits a Rollup scope-hoisting bug that breaks the self-contained webc bundle. The build script aliases the package to its UMD bundle (`@popperjs/core/dist/umd/popper.js`) only in webc mode. **Don't change or remove this without rebuilding and visually verifying every popper-based component in webc mode.**

---

## Naming, prefixing, and registration

### Default prefix: `noirium-`

Defined in [src/config.ts](../../src/config.ts) under `webComponentPrefix`. Custom elements are registered as `<noirium-<kebab-name>>`:

| Source file             | Custom element             |
| ----------------------- | -------------------------- |
| `PrimaryButton.webc.ts` | `<noirium-primary-button>` |
| `DatePicker.webc.ts`    | `<noirium-date-picker>`    |
| `Modal.webc.ts`         | `<noirium-modal>`          |

### Overriding the prefix at runtime

A consumer who is already shipping their own elements named `noirium-…` can collide. They override **before** importing any web component:

```html
<script type="module">
  import { config } from 'noirium';
  config.set('webComponentPrefix', 'acme-');
  await import('noirium/web-components/primary-button');
</script>

<acme-primary-button>Click</acme-primary-button>
```

Order matters. The `customElements.define` call runs at module import time and reads `webComponentPrefix` once.

### Name collision rules

Custom element names are **global** to the page. Defining the same name twice throws. If you load `primary-button` from two different versions of the package (e.g. host app + an iframe), the second `define` throws and the second import effectively fails. Pick one source of truth.

---

## Consuming a web component

### From npm + a bundler

```js
import 'noirium/web-components/primary-button';
```

The side-effect import registers the custom element. Use it anywhere in HTML thereafter.

### From the CDN (no bundler)

```html
<script
  type="module"
  src="https://cdn.example.com/noirium/webc/v0.1.0/primary-button.js"
></script>

<noirium-primary-button>Click me</noirium-primary-button>
```

For a snapshot:

```html
<script
  type="module"
  src="https://cdn.example.com/noirium/webc/v0.0.0-mr-1234-abc1234/primary-button.js"
></script>
```

### Passing props

Strings and booleans go via attributes:

```html
<noirium-primary-button
  variant="primary"
  disabled
  >Save</noirium-primary-button
>
```

Objects, arrays, and functions go via **properties** (set with JS):

```html
<noirium-modal
  id="dialog"
  title="Hello"
></noirium-modal>
<script type="module">
  document.getElementById('dialog').visible = true;
</script>
```

### Listening to events

Custom events bubble out of the shadow root by default in our setup. Listen with standard DOM:

```js
document.querySelector('noirium-primary-button').addEventListener('click', (e) => {
  // …
});
```

### Slots

Default slot works as expected. Named slots use the standard `<slot name="x">` mechanism on the SFC and `slot="x"` on the consumer.

---

## Testing web components

We don't run a separate test suite against the built `dist/webc/*.js` files. Instead:

- The **SFC** is unit-tested with Vitest + `@vue/test-utils` v2 in `<Component>.test.ts`.
- The **wrapper** (`*.webc.ts`) is exercised manually via the playground and via QA snapshot builds.
- The build script's invariants (file count, kebab-case naming, presence of `core.css`) are enforced implicitly by `pnpm build:webc` succeeding.

If you change the **wrapper recipe** (style injection, prefix logic, custom element class), test by:

1. `pnpm build` (full).
2. Open `dist/webc/primary-button.js` in a plain HTML page.
3. Inspect the shadow root in DevTools — `adoptedStyleSheets` should contain the reset + core styles, the host should be styled correctly.

For testing patterns that work around web-component / shadow-DOM quirks, see [Testing](./testing.md).

---

## Performance & bundle size

### Size budget

A typical web-component bundle is ~80–200 KB minified (Vue runtime ~40 KB + the SFC + its deps). Watch out for:

- Large icon imports — UnoCSS icons are tree-shaken, but make sure you don't pull a whole icon collection.
- Date libraries — v-calendar pulls a date locale; only include what you use.
- Direct `axios` imports — use `redaxios` via `ApiService` (already configured in lib).

### Chunk dedup

`build-webc.ts` writes shared chunks to `dist/webc/chunks/`. Two web components that both import `BaseBadge` should share the chunk rather than each bundling its own copy. To verify:

```sh
ls -la dist/webc/chunks/
```

If you see one chunk per component instead of shared chunks, the imports diverged (e.g. one component imports `@/features/shared/components/BaseBadge/BaseBadge.vue` directly and the other through `@/features/shared`). Always import through the feature's `index.ts`.

### Adding a runtime dependency

Every new dep you add to a feature touched by a `.webc.ts` ships with **every** webc that transitively pulls it in. Before adding:

1. Can it be implemented inline in ~50 LOC?
2. Is there already a similar util in `features/shared/lib/utils/`?
3. Does it have tree-shakeable named exports? (CommonJS-only deps are usually a no.)

When in doubt, build before and after and diff `dist/webc/chunks/` total size.

---

## Dual-build pitfalls (the bug catalog)

| Symptom                                                 | Root cause                                     | Fix                                                                  |
| ------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| Overlay/dialog renders unstyled in webc but fine in lib | `<Teleport to="body">` escaped the shadow root | Use `useTeleportTarget`                                              |
| Dropdown/tooltip pops up at wrong position in webc      | Popper offset parent = shadow host             | `positionFixed: true` in popover options                             |
| `pnpm build:webc` fails resolving `@popperjs/core`      | Popper ESM scope-hoisting bug                  | The alias to UMD must be present — don't remove it                   |
| Webc renders but with no styles at all                  | Skipped `pnpm build:lib` before `build:webc`   | Run full `pnpm build`                                                |
| Styles missing only in old browsers                     | Constructable Stylesheets unsupported          | The util has a `<style>` fallback — confirm it's still wired         |
| Custom element name collision error                     | Two versions of the package loaded             | Audit imports; use only one source                                   |
| Bundle suddenly grew by 100 KB                          | A new dep got pulled into a shared chunk       | `vp run task:build:webc`, inspect `dist/webc/chunks/`                |
| Component looks fine in Storybook but broken in webc    | Relied on host-app global CSS                  | Add the styles inside the component or via `core.css`                |
| `getElementById` from inside the SFC returns `null`     | DOM query escaped the shadow root              | Use `templateRef`/`useTemplateRef`, never `document.*` for internals |

---

## Troubleshooting

### "I added a `.webc.ts` and nothing appears in `dist/webc/`."

- Confirm filename ends in exactly `.webc.ts` (not `.webc.tsx`).
- Confirm the file is under `src/features/`.
- Run `pnpm build:webc` and watch for build errors — failures are silent in the wrong terminal.
- The discovery script catches `try { readdir }` errors silently. If a parent folder is missing, the whole subtree is skipped.

### "It builds but the element renders nothing."

- Open the page → DevTools → Elements → expand the custom element → check the shadow root contents.
- Empty shadow root → `defineCustomElement` failed silently (usually a Vue compiler error). Check the build log.
- Shadow root has content but is invisible → CSS isn't being injected. Confirm `adoptSharedWebComponentStyles` is called in `connectedCallback`.

### "It works locally but breaks on the CDN."

- Cache. The CDN aggressively caches; if you re-published a tag, the old bundle may persist. Snapshot builds use timestamped paths to avoid this.
- Path mismatch — `package.json.version` in the published bundle and the CDN folder name **must** match. The job enforces this; if you bypassed it, redeploy.

### "I see two copies of Vue in the page."

- One came from the host app's bundler (lib mode), one came bundled inside the webc. This is **expected** — the webc must be self-contained. It's not a bug, just a memory cost.

### "My change works in the playground but breaks in QA's snapshot."

- Playground uses the lib build. QA's snapshot might be testing the webc build (or both). Always re-test against the actual build mode QA used.

---

## Cheat sheet

```sh
# Build everything (do this before testing webc anywhere)
pnpm build

# Webc only (assumes lib is already built)
pnpm build:webc

# Cached build — skips if nothing relevant changed
vp run task:build:webc

# Inspect outputs
ls dist/webc/
ls dist/webc/chunks/
```

| Need                         | Where                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Build script                 | [tools/vite/build-webc.ts](../../tools/vite/build-webc.ts)                                                                                     |
| Style injection util         | [src/features/shared/lib/utils/web-component-style.util.ts](../../src/features/shared/lib/utils/web-component-style.util.ts)                   |
| Teleport helper              | [src/features/shared/composables/useTeleportTarget.ts](../../src/features/shared/composables/useTeleportTarget.ts)                             |
| Reference webc wrapper       | [src/features/shared/components/PrimaryButton/PrimaryButton.webc.ts](../../src/features/shared/components/PrimaryButton/PrimaryButton.webc.ts) |
| Runtime config (prefix etc.) | [src/config.ts](../../src/config.ts)                                                                                                           |
| Snapshot CDN deploy script   | [tools/ci/publish-webc.ts](../../tools/ci/publish-webc.ts)                                                                                     |
| CI / Pages deploy            | [`.github/workflows/storybook-pages.yml`](../../.github/workflows/storybook-pages.yml) |

### Hard rules

- **NEVER** write `<Teleport to="body">` in a component shipping as webc — use `useTeleportTarget`.
- **NEVER** change popper aliasing or shadow-DOM style injection in `build-webc.ts` without re-testing every popper component in webc mode.
- **NEVER** add a runtime dep without weighing the impact on every webc bundle.
- **ALWAYS** verify popper-based and shadow-DOM-exposed components still render correctly in the webc build when touched.
- **ALWAYS** run `vp run task:build:webc` after touching shared code that webc components depend on.
