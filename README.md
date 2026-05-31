# Noirium UI

Vue 3 + TypeScript UI kit. Ships as both a Vue library (ESM/CJS) and standalone Web Components (Shadow DOM).

## Installation

```bash
pnpm add noirium
```

## Usage

### Vue plugin

Register all components globally:

```ts
import { createApp } from 'vue';
import NoiriumUI from 'noirium';
import 'noirium/style.css';

const app = createApp(App);
app.use(NoiriumUI, { prefix: 'Noirium' }); // optional prefix
```

Components are registered globally (or with the given prefix, e.g. `NoiriumPrimaryButton`). See `src/entries/index.ts` for the current list.

### Individual imports

Import only what you need:

```ts
import { PrimaryButton, Modal } from 'noirium/ui';
import 'noirium/style.css';
```

### Utility functions

```ts
import { formatShortDate, formatFullTime, formatDuration } from 'noirium/utils';

formatShortDate('2025-08-27 14:00:00'); // "Wed, Aug 27th"
formatFullTime('2025-08-27 14:00:00'); // "2:00 PM EST"
formatDuration('05:18:00'); // "5h 18min"
```

### Types

```ts
import type { ToastOptions, CountdownProps } from 'noirium/types';
```

### Integrations

```ts
import { ApiService, isAxiosError, extractApiErrorMessage } from 'noirium/integrations';

const data = await ApiService.get<MyType>('/api/endpoint');
```

### Web Components

Use without a bundler or framework. Available web components are built from `*.webc.ts` files in `src/features/shared/` — run `pnpm build:webc` and check `dist/webc/` for the current list.

```html
<script type="module">
  import 'noirium/web-components/primary-button';
</script>

<noirium-primary-button variant="primary">Click Me</noirium-primary-button>
```

## Package exports

| Import path                | Contents                          |
| -------------------------- | --------------------------------- |
| `noirium`                  | Everything + default Vue plugin   |
| `noirium/ui`               | UI components only                |
| `noirium/utils`            | Date formatting, string utilities |
| `noirium/types`            | TypeScript types                  |
| `noirium/integrations`     | `ApiService`, error helpers       |
| `noirium/style.css`        | Bundled CSS                       |
| `noirium/web-components/*` | Individual web component bundles  |

## Development

### Prerequisites

- Node.js LTS (see `.nvmrc`)
- pnpm latest (enforced by `packageManager`)

### Setup

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm storybook    # Storybook on :6006
```

### Commands

```
pnpm dev              # Dev server
pnpm storybook        # Storybook
pnpm playground       # Playground app
pnpm build            # Full build (lib + web components)
pnpm build:lib        # Vue library only
pnpm build:webc       # Web components only
pnpm test             # Tests (watch mode)
pnpm coverage         # Tests with coverage report
pnpm lint             # Oxlint
pnpm format           # Oxfmt check
pnpm format:fix       # Oxfmt fix
pnpm typecheck        # vue-tsc
pnpm css:check        # Validate CSS bundle output
pnpm changeset        # Record a user-visible change
pnpm changeset:status # Show pending changesets and next version
```

### AI-assisted workflows

The project ships skills and slash commands shared across Claude Code, Cursor, Codex CLI, and Gemini CLI. Canonical bodies live in [`.agents/`](./.agents/); per-tool shims live in [`.claude/`](./.claude/) and [`.cursor/`](./.cursor/). See [AGENTS.md](./AGENTS.md) for orientation.

### Local development in a consumer project

To use a local build of `noirium` in another project without publishing:

```bash
# In noirium — register the package globally and watch for changes
pnpm build:lib
vp link

# In the consumer project — point at the local build
vp link noirium
```

Re-run `pnpm build:lib` in noirium whenever you change something; the consumer project picks up the new build automatically.

When done, unlink in both places:

```bash
# In the consumer project
pnpm unlink noirium && pnpm install

# In noirium
pnpm unlink --global
```

### Contributing

1. Create a feature branch from `main`
2. Make changes, co-locate tests (`.test.ts`) and stories (`.stories.ts`) next to components
3. If the change is user-visible, run `pnpm changeset` and commit the generated `.changeset/*.md` file
4. Run `pnpm lint && pnpm format && pnpm typecheck && pnpm test`
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
6. Open a pull request against `main` on [GitHub](https://github.com/AminHadei/noirium)

Pre-commit hooks (Husky) enforce linting, formatting, and commit message conventions automatically.

## Versioning

Versions are managed by [Changesets](https://github.com/changesets/changesets). See [docs/content/changesets.md](./docs/content/changesets.md) or run `pnpm docs:dev` for the full guide.

## Further reading

- **Live docs:** [aminhadei.github.io/noirium](https://aminhadei.github.io/noirium/)
- **Component demo (Storybook):** [aminhadei.github.io/noirium/storybook](https://aminhadei.github.io/noirium/storybook/)
- **Repository:** [github.com/AminHadei/noirium](https://github.com/AminHadei/noirium)
- [AGENTS.md](./AGENTS.md) — orientation for AI coding tools
- [docs/](./docs/content/index.md) — developer handbook (`pnpm docs:dev` to preview locally)
- [CHANGELOG.md](./CHANGELOG.md) — version history
