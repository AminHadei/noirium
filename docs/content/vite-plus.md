# Vite+

`noirium` uses [Vite+](https://vite.plus), a unified toolchain that wraps Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task in a single global CLI called `vp`. Vite+ also wraps runtime management and package management.

For first-run commands and workspace setup see [Getting started](./getting-started.md). For the project-specific task graph (`task:build:lib`, `task:test`, `task:css:check`, `task:pre-commit`) see [Getting started → Vite+ task runner](./getting-started.md#vite-task-runner).

## The CLI

`vp` is a global binary that handles the full development lifecycle. Run `vp help` for the list and `vp <command> --help` for details. The command groups:

### Start

- `create` — create a new project from a template
- `migrate` — migrate an existing project to Vite+
- `config` — configure hooks and agent integration
- `staged` — run linters on staged files
- `install` (`i`) — install dependencies
- `env` — manage Node.js versions

### Develop

- `dev` — run the development server
- `check` — run format, lint, and TypeScript type checks
- `lint` — lint code
- `fmt` — format code
- `test` — run tests

### Execute

- `run` — run monorepo tasks
- `exec` — execute a command from local `node_modules/.bin`
- `dlx` — execute a package binary without installing it as a dependency
- `cache` — manage the task cache

### Build

- `build` — build for production
- `pack` — build libraries
- `preview` — preview production build

### Manage dependencies

Vite+ auto-detects the underlying package manager via the `packageManager` field or lockfile. In this repo, that is **pnpm**.

- `add` — add packages to dependencies
- `remove` (`rm`, `un`, `uninstall`) — remove packages
- `update` (`up`) — update packages
- `dedupe` — deduplicate
- `outdated` — check for outdated packages
- `list` (`ls`) — list installed packages
- `why` (`explain`) — show why a package is installed
- `info` (`view`, `show`) — view package info from the registry
- `link` (`ln`) / `unlink` — manage local package links
- `pm` — forward a command to the package manager

### Maintain

- `upgrade` — update `vp` itself

## Pitfalls

- **Don't use the package manager directly.** Vite+ wraps pnpm; prefer `vp add` / `vp remove` / `vp install`. Direct `pnpm` calls work but are not the convention. Never use `npm` or `yarn`.
- **Don't run `vp vitest` or `vp oxlint` — they don't exist.** Use `vp test` and `vp lint`.
- **Built-in commands take precedence over `package.json` scripts.** If a script shares a name with a built-in (e.g. a custom `dev` that runs multiple services), invoke it as `vp run dev`. `vp dev` always starts Vite's dev server.
- **Don't install `vitest`, `oxlint`, `oxfmt`, or `tsdown` directly.** Vite+ wraps them. Upgrade via `vp upgrade`.
- **Use `vp dlx` instead of `npx`** for one-off binaries.
- **Import test/build modules from `vite-plus`.** Use:
  ```ts
  import { defineConfig } from 'vite-plus';
  import { expect, test, vi } from 'vite-plus/test';
  ```
  Do not install `vitest` to import test utilities.
- **Type-aware linting works out of the box.** Don't install `oxlint-tsgolint`; `vp lint --type-aware` is enough.

## Imports

```ts
// Build / dev config
import { defineConfig } from 'vite-plus';

// Test utilities
import { describe, it, expect, vi } from 'vite-plus/test';
```

## CI integration

For GitHub Actions, [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) replaces separate Node/pnpm setup steps. See [CI](./ci.md).

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review checklist for agents

- Run `vp install` after pulling remote changes and before getting started.
- Run `vp check` and `vp test` (or `vp run task:pre-commit`) to validate changes.

## See also

- [Getting started](./getting-started.md) — commands and the project task graph
- [Conventions](./conventions.md) — hard boundaries on tools and imports
- [Testing](./testing.md) — `vite-plus/test` import path
