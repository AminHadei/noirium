# Styling — Developer Wiki

> How CSS is authored, scanned, compiled, and shipped in `noirium`. Covers UnoCSS configuration, the `:uno:` transformer prefix, theme tokens, icons, Shadow-DOM-safe patterns, and the `task:css:check` validator that guards the bundle.

This file is the deep guide. For Shadow-DOM-specific style mechanics, see [Web components](./web-components.md) → _Style isolation deep-dive_.

---

## Table of contents

1. [Toolchain at a glance](#toolchain-at-a-glance)
2. [UnoCSS configuration](#unocss-configuration)
3. [Theme tokens](#theme-tokens)
4. [Writing styles in SFCs](#writing-styles-in-sfcs)
5. [The `:uno:` class-transformer prefix](#the-uno-class-transformer-prefix)
6. [Shortcuts and the safelist](#shortcuts-and-the-safelist)
7. [Icons](#icons)
8. [The `task:css:check` validator](#the-taskcsscheck-validator)
9. [Global vs. scoped styles](#global-vs-scoped-styles)
10. [Styling for Shadow DOM](#styling-for-shadow-dom)
11. [Storybook & playground](#storybook--playground)
12. [Common pitfalls](#common-pitfalls)
13. [Cheat sheet](#cheat-sheet)

---

## Toolchain at a glance

| Tool                                             | Role                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **UnoCSS** with the `wind4` (Tailwind v4) preset | Atomic utility CSS. Scans templates → emits the CSS used.                            |
| **`presetIcons`**                                | Pure-CSS SVG icons. Auto-discovered from `src/assets/icons/`.                        |
| **`transformerCompileClass`**                    | Compacts `:uno:` blocks into a single hashed class name. Production-only.            |
| **`@unocss/reset/tailwind.css`**                 | The Tailwind reset, applied as a base layer.                                         |
| **Vite**                                         | Runs UnoCSS in the lib build; runs it again (in `mode: 'global'`) in the webc build. |
| **`tools/ci/validate-output-css.sh`**            | Post-build validator that fails CI when bare utilities leak into the bundle.         |
| **Oxfmt**                                        | Sorts Tailwind classes inside `class="…"`.                                           |

The single source of truth is [`uno.config.ts`](../../uno.config.ts). The icon registry is [`tools/uno/icons.ts`](../../tools/uno/icons.ts).

---

## UnoCSS configuration

Highlights from [`uno.config.ts`](../../uno.config.ts):

```ts
presets: [
  presetWind4({
    preflights: { reset: false, property: { parent: false } },
    theme: { process: createRemToPxProcessor() },   // px-based output
  }),
  presetIcons({ collections: iconCollections, … }), // see Icons section
],
content: {
  pipeline: { include: [resolve(__dirname, 'src/features/**/*.{vue,ts}')] },
},
safelist: ['form-main-input'],
shortcuts: { /* see Shortcuts */ },
theme:    { /* see Theme tokens */ },
transformers: [],
```

Production-only — appended at the bottom of `uno.config.ts`:

```ts
if (process.env.NODE_ENV === 'production' && process.env.MODE !== 'test') {
  config.transformers.push(transformerCompileClass());
}
```

So `transformerCompileClass` only runs at build time. In dev/Storybook/test you'll see raw utility lists; in `dist/lib/core.css` you'll see compiled class names like `.uno-abc123`.

### Why `reset: false` and `property.parent: false`

- `reset: false` — we ship `@unocss/reset/tailwind.css` separately so the reset is included verbatim in `core.css` and can be opted into / out of by the consumer.
- `property.parent: false` — disables wrapping CSS variable definitions in a `@layer` so they land at the document root and are inheritable into shadow DOM via `:host`.

### `createRemToPxProcessor`

Converts UnoCSS's default `rem`-based scale into `px` so visual sizes don't depend on the host page's `html { font-size }`. This is important for the webc build, where the shadow root inherits the host's font size.

### `content.pipeline.include`

Restricted to `src/features/**/*.{vue,ts}`. Files outside that glob (Storybook config, the playground, tests) are **not** scanned for utilities. If you add a new top-level source folder that contains classes, update this glob.

---

## Theme tokens

Noirium uses a **monochrome palette** (`#000`–`#fff`) — semantic tokens map to neutral grays so components stay on-brand without chromatic accents.

```ts
theme: {
  colors: {
    current: 'currentColor',
    primary: '#171717',
    'text-darker': '#0A0A0A',
    'text-dark': '#525252',
    'text-light': '#A3A3A3',
    border: '#E5E5E5',
    'border-hover': '#737373',
    surface: '#F5F5F5',
    'surface-muted': '#FAFAFA',
    'surface-strong': '#E5E5E5',
    destructive: '#404040',
    // status-* — BaseBadge & Toast only (see Status colors below)
    'status-red': '#DB2C00',
    'status-green': '#00816E',
    'status-blue': '#2563EB',
    'status-yellow': '#F59E0B',
    'status-red-strong': '#C10007',
    'status-badge-red-bg': '#FEE2E2',
    'status-badge-red-text': '#B91C1C',
    'status-badge-green-bg': '#D1FAE5',
    'status-badge-green-text': '#047857',
  },
  font: {
    noto: 'Noto Sans',
    figtree: 'Figtree',
  },
}
```

### Status colors (chromatic exception)

The global palette stays monochrome. **`BaseBadge`** uses paired `status-badge-*` tints for `red` / `green`, monochrome tokens for `white` / `gray` / `black`, and inline `style` for `color="custom"` (see [BaseBadge](./features/base-badge.md)). **`Toast`** uses `status-*` on the **status icon circle only** — panel, title, description, and close control stay neutral. Do not use `status-*` elsewhere; add a new token in [`uno.config.ts`](../../uno.config.ts) only when one of those surfaces needs it.

Use semantic names rather than hex values inside SFCs:

```vue
<!-- good -->
<button class="bg-primary text-white">Save</button>
<p class="text-text-darker font-noto">Heading</p>

<!-- avoid -->
<button class="bg-[#171717] text-white">Save</button>
```

### When to use a one-off color

- Brand color used once → `bg-[#abc123]` is fine.
- Reused twice → add it to the theme.
- If the color belongs to a feature only (e.g. a chart palette), keep it inline; don't pollute the global theme.

### Fonts

Fonts are referenced by **family name** (`Noto Sans`, `Figtree`). The actual font files are loaded by the **host application**, not by `noirium`. Inside web components the host's `@font-face` declarations are inherited — but only because `@font-face` is scoped to the document, not the shadow root. Document this requirement in the consumer-facing snippet.

---

## Writing styles in SFCs

### Default: utility classes in `class="…"`

```vue
<template>
  <button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
    <slot />
  </button>
</template>
```

Oxfmt sorts these on save / `pnpm format:fix`.

### `<style scoped>` for component-specific CSS

```vue
<style scoped>
  .fancy-glow {
    box-shadow: 0 0 24px rgba(142, 85, 255, 0.4);
  }
</style>
```

`scoped` is preferred. Without it, the rule leaks into every consumer (lib mode) and into every shadow root (webc mode).

### `<style>` (unscoped) — only when intentional

Use unscoped styles for things that **must** apply to the whole component tree (animations, keyframes targeting children, Reset overrides). Document the why with a one-line comment.

### Inline `style="…"` — last resort

Fine for one-off computed values (a dynamic gradient stop). Anything reusable belongs in a class.

---

## The `:uno:` class-transformer prefix

### What it does

`transformerCompileClass` looks for class lists wrapped in `:uno:` and compacts them into a single hashed class name in the production bundle:

```vue
<!-- Source -->
<button :class="`:uno:bg-primary text-white px-4 py-2 rounded`">Save</button>

<!-- Production CSS bundle -->
.uno-x9f2k1 { background: #171717; color: #fff; padding-left: 1rem; padding-right: 1rem; … }

<!-- Production HTML -->
<button class="uno-x9f2k1">Save</button>
```

### Why it matters here

In the **web-component build**, `core.css` is injected into every shadow root. The smaller and more deduplicated it is, the lighter every webc bundle becomes. `:uno:` blocks become single class names instead of N independent utility selectors.

### When to use `:uno:`

- ✅ Long utility strings on elements (5+ utilities).
- ✅ Anywhere in a component that ships as a `.webc.ts`.
- ✅ Repeated identical class lists across multiple elements (compile-time dedup).
- ❌ One or two utilities — overhead isn't worth it.
- ❌ Class lists that vary based on props (the transformer can't compile dynamic strings).

### How to write it

Inside template strings (the prefix is recognized by the transformer):

```vue
<button :class="`:uno:bg-primary text-white px-4 py-2 rounded hover:bg-primary/90`">
  <slot />
</button>
```

For static `class=""`, inline computation isn't needed — the transformer can also see attribute strings, but a template literal makes the intent explicit and survives template refactors better.

### When **not** to write a utility-looking string

The extractor scans `.ts` and `.vue` files for utility-looking tokens. Any string in `<script>` that _looks_ like a Tailwind utility (`bg-primary`, `text-lg`, …) **will** be scanned and ends up in the bundle, even if you never used it as a class. Three workarounds, in order of preference:

1. **Wrap the template usage in `:uno:`** so the bundle only contains the compiled class.
2. **Wrap the script block in `@unocss-skip-start` / `@unocss-skip-end`** comments. This is the right tool for utility-looking strings used as **identifiers, keys, or data** — not as rendered classes.
3. **Move the string out of UnoCSS's scanned content** (rename, restructure).

> Never "fix" a `task:css:check` failure by editing the validator. Fix the input.

---

## Shortcuts and the safelist

### Shortcuts (`uno.config.ts`)

```ts
shortcuts: {
  'line-height-150': 'leading-[150%]',
  'line-height-115': 'leading-[115%]',
  'line-height-normal': 'leading-[100%]',
  'form-main-input':
    'border border-border hover:border-border-hover focus-visible:outline-none ' +
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all',
}
```

Use these whenever the same utility combo appears in multiple components — the shortcut is one identifier in HTML and one rule in CSS.

### Safelist

`form-main-input` is in the **safelist**. It must remain there because some consumers reference it dynamically (or it's emitted in places UnoCSS can't statically detect). Removing it silently breaks form input styling in those code paths.

When to add to the safelist:

- A class name is constructed dynamically (template-literal interpolation that UnoCSS can't fully resolve).
- A class is referenced from outside `content.pipeline.include` (e.g. from the playground using a className built at runtime).

When **not** to add to the safelist:

- You're adding a normal utility used in a normal `class=""` — UnoCSS will pick it up automatically.
- You're trying to silence a `task:css:check` failure — that's the wrong fix.

---

## Icons

### How discovery works

[`tools/uno/icons.ts`](../../tools/uno/icons.ts) reads every `.svg` file under `src/assets/icons/` at config-load time and registers each as a one-icon "collection" named by the filename.

```ts
// File: src/assets/icons/check-circle.svg
// Becomes the icon: i-check-circle
```

To add an icon:

1. Drop the SVG into `src/assets/icons/`.
2. Reference it as `i-<filename-without-extension>`:
   ```vue
   <span class="i-check-circle text-primary text-2xl"></span>
   ```
3. UnoCSS's `presetIcons` emits a CSS rule that uses the SVG as a `mask-image`, sized to `1em` × `1em` by default (overridable with `text-*` for size and `text-*` for color via `currentColor`).

### Icon styling rules

- Set size with `text-*` utilities (icon size = font-size).
- Set color with `text-*` (icons use `currentColor`).
- The `extraProperties` in `uno.config.ts` set `display: block; vertical-align: middle` — works in most layouts. Override with utilities when you need inline-flex, etc.

### Icons in webc

The `i-*` rules become part of `core.css` and ship inside every shadow root. The SVG itself is inlined as a data-URL inside the rule, so there's no network request from inside the shadow tree. This means:

- ✅ No CORS issues.
- ✅ No FOUC.
- ⚠️ Adding hundreds of icons inflates `core.css`. Audit periodically.

---

## The `task:css:check` validator

### What it does

`tools/ci/validate-output-css.sh` (run by `vp run task:css:check`) scans `dist/lib/core.css` for utility classes that should have been compiled away or never extracted in the first place. It fails the build when bare utilities leak into the bundle.

### When it runs

- Locally: as part of `vp run task:pre-commit`.
- In CI: as part of the post-build verification.
- The Vite+ task is **cached** on `dist/lib/core.css`, so re-running with no changes is essentially free.

### When it fails

The root cause is **almost always** a bare utility string that UnoCSS extracted when it shouldn't have. Fix it with one of these (in order of preference):

1. **Wrap the template usage in `:uno:`** so the transformer compacts it.
2. **Wrap the script block in `@unocss-skip-start` / `@unocss-skip-end`** if it's a non-class string that just looks like a utility.
3. **Move the string out of UnoCSS's scanned content** as a last resort.

**Never** "fix" `task:css:check` by editing the validator script or loosening its patterns. The validator exists because uncompiled utilities silently bloat every webc bundle.

### What the failure looks like

The script prints the offending selectors. Locate them by `Grep`-ing for the utility name in `src/features/**/*.{vue,ts}` and pick the right fix above.

---

## Global vs. scoped styles

### Hard rule

> **Do not introduce global styles that affect host applications.** Styles ship scoped inside SFCs or as an opt-in `dist/lib/core.css` import.

### What's allowed

- `<style scoped>` inside an SFC.
- UnoCSS utilities — they live in `core.css`, which the consumer **opts into** via `import 'noirium/style.css'`.
- Reset rules — also in `core.css`, opted in the same way.

### What's not allowed

- `<style>` (unscoped) targeting host-app elements (`body`, `html`, `*`, generic tag names).
- Side-effect imports of CSS files from feature code (`import './global.css'` inside an SFC). All CSS goes through Vue's SFC pipeline or via the explicit entry.
- CSS that depends on existing in the host's cascade (e.g. `body.dark .my-thing { … }`).

If you genuinely need a global tweak (animation keyframes, CSS variables for theming), put it in `core.css` via UnoCSS preflights or as a shortcut, and document it in the consumer integration notes.

---

## Styling for Shadow DOM

For the full mechanics, see [Web components](./web-components.md) → _Style isolation deep-dive_. The styling-side rules:

| Rule                                           | Why                                                                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Use `:host` instead of `:root` for variables   | `:root` doesn't exist inside the shadow tree. `core.css` is `replaceAll(':root', ':host')`-rewritten at injection time.    |
| Don't rely on global host CSS                  | Global styles do **not** cross the shadow boundary.                                                                        |
| Inherit CSS variables from `:host`             | CSS custom properties **do** inherit through `:host`, so consumer-provided `--primary-color` reaches inside if you opt in. |
| Don't `@font-face` inside the shadow root      | Document the required fonts; the host page must declare them.                                                              |
| Use `:uno:` aggressively                       | Smaller `core.css` = smaller every webc bundle.                                                                            |
| Test the look in webc mode, not just Storybook | Storybook runs in lib mode; it can't catch shadow-DOM-only regressions.                                                    |

---

## Storybook & playground

### Storybook

- Runs in **lib mode** with the same `uno.config.ts`. You see styles exactly as a Vue host app would.
- `tools/storybook/styles.css` provides the minimum reset for the Storybook iframe.
- Stories don't get the `transformerCompileClass` treatment (we only enable it in production).
- **Storybook cannot catch shadow-DOM regressions.** Use the playground or a snapshot build for that.

### Playground

- A separate workspace package at `playground/`.
- Imports the lib through pnpm workspace resolution.
- Run with `pnpm playground` (opens a Vite dev server).
- Use it for:
  - Side-by-side lib vs. webc comparison.
  - Manual smoke tests before publishing a snapshot.
  - Reproducing consumer issues.

---

## Common pitfalls

| Symptom                                                   | Likely cause                                                 | Fix                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `task:css:check` fails after a change                     | Bare utility-looking string was extracted                    | Wrap template usage in `:uno:`, or wrap script string in `@unocss-skip-*`, or rename the string       |
| Component looks unstyled inside a webc                    | `core.css` not injected, or `:root` not rewritten to `:host` | Confirm `adoptSharedWebComponentStyles` is called; don't hand-roll style injection                    |
| Icon doesn't render                                       | Filename mismatch, or SVG file outside `src/assets/icons/`   | Icon class is `i-<filename>`; check it loaded with DevTools                                           |
| Custom font missing inside webc                           | Font not loaded by host page                                 | Document the `@font-face` requirement to the consumer; don't try to declare it inside the shadow root |
| Class works in Storybook but missing in production bundle | Class was outside `content.pipeline.include` glob            | Move source into `src/features/`, or add to `safelist` if it's truly dynamic                          |
| `core.css` ballooned in size                              | Lots of one-off arbitrary values, or new icons added         | Audit `dist/lib/core.css`; promote repeated arbitrary values to theme tokens                          |
| Two different shades for "primary" appear                 | Hex used inline somewhere instead of `bg-primary`            | Search for the hex; replace with token                                                                |
| Hover/focus styles look wrong inside webc                 | Relied on host-app focus-visible polyfill                    | Don't rely on host polyfills; use native pseudo-classes only                                          |

---

## Cheat sheet

```sh
# Run the CSS bundle validator (auto-rebuilds lib if needed)
vp run task:css:check

# Full pre-commit pipeline (lint + format + test + css:check)
vp run task:pre-commit

# Format (also sorts Tailwind classes)
pnpm format
pnpm format:fix
```

| Need             | Where                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| UnoCSS config    | [uno.config.ts](../../uno.config.ts)                                     |
| Icon registry    | [tools/uno/icons.ts](../../tools/uno/icons.ts)                           |
| Icons folder     | [src/assets/icons/](../../src/assets/icons/)                             |
| Bundle validator | [tools/ci/validate-output-css.sh](../../tools/ci/validate-output-css.sh) |
| Built CSS        | `dist/lib/core.css` (generated)                                          |
| Storybook setup  | [tools/storybook/](../../tools/storybook/)                               |
| Playground       | [playground/](../../playground/)                                         |

### Hard rules

- **`form-main-input` must remain in the safelist.**
- **No global styles that affect host applications.**
- **`task:css:check` failures must be fixed at the source** (use `:uno:` or `@unocss-skip-*`), not by loosening the validator.
- **Use the `:uno:` prefix** for utility-heavy class lists, especially in components that ship as web components.
- **Theme tokens (`primary`, `text-darker`, …) over hex values** for any reused color.
