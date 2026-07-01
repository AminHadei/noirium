# Architecture

Technical architecture of **Noirium UI** (`noirium`). For installation and commands see [Getting started](./getting-started.md).

## Dual distribution

The library produces two outputs from a single source tree:

1. **Vue library** (`dist/lib/`) — multi-entry ESM (`.mjs`) + CJS (`.cjs`). Vue is externalized as a peer dependency. Types emitted to `dist/types/` via `vite-plugin-dts`. CSS extracted to `dist/lib/core.css`.
2. **Web Components** (`dist/webc/`) — self-contained Shadow-DOM bundles, one file per component. Each includes the Vue runtime, component code, and injected styles. No external dependencies required at runtime.

Build configs live in `tools/vite/`:

- `vite.lib.config.ts` — Vite library mode with multiple entry points (`src/entries/*.ts`).
- `build-webc.ts` — custom Node script that scans `src/features/**/*.webc.ts`, builds each as an independent IIFE bundle with Terser minification, and injects UnoCSS + Tailwind reset into the Shadow DOM.

Key constraint: `@popperjs/core` is aliased to its UMD build in the web-component config because the ESM build triggers a Rollup scope-hoisting bug. Popper-based components must also use `positionFixed: true` since `position: absolute` breaks when the offset parent is a shadow host. See [Web components](./web-components.md).

## Feature-based architecture

Components live under `src/features/`. Legacy UI (`PrimaryButton`, `Modal`, `Toast`, …) remains in `shared/`; new domain components land in sibling features (`buttons`, `forms`, `feedback`, …) and export through `src/features/index.ts` → `src/entries/ui.ts`. See [ADR 0002](./decisions/0002-multi-feature-component-layout.md) and [Component parity](./component-parity.md).

```
src/features/
  shared/           # Legacy UI kit + ApiService, utils
  buttons/          # IconButton, …
  data-display/     # Text, …
  forms/            # Label, …
  feedback/         # Alert, …
```

Each component follows the same shape:

```
components/<ComponentName>/
  <ComponentName>.vue          # SFC
  <ComponentName>.test.ts      # Unit test (co-located, required for new components)
  <ComponentName>.stories.ts   # Storybook story (required for new UI)
  <ComponentName>.webc.ts      # Web component wrapper (optional)
lib/
  services/                    # ApiService and HTTP helpers
  composables/                 # Vue composables
  utils/                       # Pure functions
  types.ts                     # Shared types
  __mock__/                    # Optional MSW handlers + data factories (add when needed)
index.ts                       # Public surface
```

## Directory layout

```
src/
  entries/          # Public API entry files (one per package subpath export)
  features/         # Feature-first organization (shared UI kit today)
  assets/icons/     # SVGs auto-discovered by UnoCSS at build time
  mocks/            # MSW server aggregation (src/mocks/node.ts)
  config.ts         # Library runtime config (API base, web-component prefix)
tools/
  vite/             # vite.lib.config.ts, vite.shared.config.ts, build-webc.ts, plugins/
  storybook/        # main.ts, preview.ts, manager.ts, styles.css
  vitest/setup.ts   # Global test setup (MSW, ResizeObserver mock, unocss import)
  uno/icons.ts      # Dynamic icon collection
  ci/               # GitHub Actions helpers (check-changeset.sh, validate-output-css.sh, …)
  husky/            # Git hooks
playground/         # Separate workspace package for manual testing
docs/               # VitePress site (this site)
```

## Entry layer

`src/entries/` contains one file per `package.json` export:

| Entry file        | Export path            | Content                                                    |
| ----------------- | ---------------------- | ---------------------------------------------------------- |
| `index.ts`        | `noirium`              | Vue plugin (`app.use(NoiriumUI, { prefix })`) + re-exports |
| `ui.ts`           | `noirium/ui`           | UI components and composables                              |
| `utils.ts`        | `noirium/utils`        | Date formatting, string utilities                          |
| `types.ts`        | `noirium/types`        | Type-only exports                                          |
| `integrations.ts` | `noirium/integrations` | `ApiService`, `AxiosError`, error helpers                  |

Web components are exposed individually via the `./web-components/*` wildcard export.

When adding a new public export, update the matching `src/entries/*.ts` file. Internal helpers must not leak into entry files.

## Toolchain

| Tool                 | Purpose                            |
| -------------------- | ---------------------------------- |
| pnpm 10.33+          | Package management, workspace      |
| Vite+ (`vp` CLI)     | Wraps Vite, Vitest, Oxlint, Oxfmt  |
| Rolldown (via Vite+) | Bundler                            |
| vue-tsc              | Type checking                      |
| UnoCSS (Wind v4)     | Utility CSS + icon system          |
| Husky                | Git hooks (pre-commit, commit-msg) |
| commitlint           | Conventional Commits enforcement   |
| MSW                  | API mocking (tests + Storybook)    |
| Storybook 10         | Component documentation            |
| vite-plugin-dts      | Type declaration generation        |
| Terser               | Web component minification         |

## See also

- [Components](./components.md) — component shape, naming, lazy-loaded overlays
- [Web components](./web-components.md) — dual-build pitfalls and the webc recipe
- [API patterns](./api-patterns.md) — runtime config facade and ApiService
- [Styling](./styling.md) — UnoCSS, theme tokens, Shadow-DOM CSS
- [CI](./ci.md) — pipeline stages and where the config lives
- [Decisions](./decisions/index.md) — ADRs for structural choices
