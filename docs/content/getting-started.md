# Getting started

`noirium` is a Vue 3 + TypeScript component library that ships two distributions from one source tree: a Vue library (`dist/lib/`) and standalone Web Components (`dist/webc/`).

## Prerequisites

- **Vite+ (`vp` CLI):** install globally first, following [https://viteplus.dev](https://viteplus.dev). Every command below assumes `vp` is on your `PATH`.
- **Node:** version pinned in `.nvmrc` (24.x). Use `vp env`, `nvm use`, or any tool that respects it.
- **Package manager:** pnpm, wrapped by Vite+. Don't use npm or Yarn directly.

## Install

```sh
vp install
```

This installs the root workspace, the `playground/` app, and the `docs/` VitePress site.

## Commands

The canonical commands are exposed both as `pnpm` scripts and as Vite+ tasks. Prefer `vp run task:*` when a task has cached dependencies — the runner skips unchanged work.

```sh
vp dev                         # Vite dev server
pnpm storybook                 # Storybook on :6006
pnpm playground                # Run playground app
vp test                        # Vitest (watch by default)
vp test run                    # one-shot
vp test run --coverage         # one-shot with v8 coverage
vp lint .                      # Oxlint (type-aware enabled)
vp fmt . --check               # Oxfmt check
vp fmt . --write               # Oxfmt write
pnpm spellcheck                # cspell across the repo
pnpm typecheck                 # vue-tsc --noEmit
pnpm build                     # lib + webc (full release build)
pnpm build:lib                 # Vue library only
pnpm build:webc                # Web components only
pnpm changeset                 # record a user-visible change (see Changesets)
pnpm changeset:status          # show pending changesets and next version
pnpm docs:dev                  # VitePress site on :5173
pnpm docs:build                # build the static docs site
```

Run a single test file:

```sh
vp test run src/path/to/Component.test.ts
```

## Vite+ task runner

`vite.config.ts` defines a `run.tasks` graph with dependencies and input-based caching. Prefer `vp run task:<name>` for cached, dependency-aware execution:

| Task                   | Inputs / depends on                                       |
| ---------------------- | --------------------------------------------------------- |
| `task:build:lib`       | inputs: `src/**/*`                                        |
| `task:build:webc`      | depends on `task:build:lib`                               |
| `task:build:storybook` | depends on `task:build:webc`                              |
| `task:css:check`       | depends on `task:build:lib`; inputs: `dist/lib/core.css`  |
| `task:test`            | inputs: `src/**/*`                                        |
| `task:pre-commit`      | runs `vp staged` (lint + format + cspell on staged files) |
| `task:pre-push`        | chains `vp run task:css:check && vp run task:test`        |

For example, `vp run task:css:check` rebuilds the library first if `src/**/*` changed, then skips both build and check if nothing changed since the last run.

## Environment

The library is configured at runtime by the consumer app via the `config` facade (see [API patterns](./api-patterns.md)). For local development, the playground sets sensible defaults; no `.env` file is required at the library root.

## First task

1. Pick a feature directory under `src/features/`.
2. Read [Architecture](./architecture.md) and [Components](./components.md) before adding files.
3. Scaffold a new component with the `/component` command (or by hand, copying `src/features/shared/components/PrimaryButton/` as a template).
4. Run `vp run task:pre-commit` before declaring the change complete.
5. Add a changeset with `pnpm changeset` for any user-visible change. See [Changesets](./changesets.md).

## See also

- [Architecture](./architecture.md) — mental model and directory layout
- [Vite+](./vite-plus.md) — the `vp` CLI in detail
- [Conventions](./conventions.md) — review-enforced rules
- [Git conventions](./git-conventions.md) — commit format and branch naming
