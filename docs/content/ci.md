# CI

GitHub Actions workflows for `noirium`. Definitions live in [`.github/workflows/`](../../.github/workflows/).

## Workflows

| Workflow             | File                  | Triggers                             | Purpose                                                                    |
| -------------------- | --------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| **CI**               | `ci.yml`              | PR + push to `main`                  | lint, format, typecheck, test; changeset check; PR coverage + failure bots |
| **Deploy Pages**     | `storybook-pages.yml` | push to `main`, manual               | Publish VitePress docs + Storybook to GitHub Pages                         |
| **Release**          | `release.yml`         | manual                               | Consume changesets on `main`, commit version bump, push tag                |
| **Publish**          | `publish.yml`         | push to `main`, manual               | If `package.json` version is new on npm: build, publish, optional webc CDN, GitHub Release |
| **Publish snapshot** | `snapshot.yml`        | manual (PR number)                   | Prerelease npm dist-tag + webc for QA                                      |

Supporting scripts: [`tools/ci/`](../../tools/ci/) — see [`tools/ci/README.md`](../../tools/ci/README.md).

## GitHub Pages (docs + Storybook)

The **Deploy Pages** workflow builds VitePress (`pnpm docs:build`) and Storybook (`pnpm build-storybook`), then publishes a combined site (same layout as the former GitLab Pages job):

| Path          | Content                     |
| ------------- | --------------------------- |
| `/`           | VitePress handbook          |
| `/storybook/` | Component demos (Storybook) |

Default URLs:

- Docs: **[https://aminhadei.github.io/noirium/](https://aminhadei.github.io/noirium/)**
- Storybook: **[https://aminhadei.github.io/noirium/storybook/](https://aminhadei.github.io/noirium/storybook/)**

`DOCS_BASE` and `STORYBOOK_BASE` are set in the workflow so asset paths resolve under the `/noirium/` project prefix.

### One-time repo setup

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. Push to `main` (or run the workflow manually). After the first successful run, Storybook is live at the URL above.

### Custom subdomain

In **Settings → Pages → Custom domain**, enter e.g. `storybook.example.com`. Add a DNS CNAME pointing at `aminhadei.github.io`. GitHub provisions HTTPS automatically.

### Private repositories

GitHub Pages on a **private** repo requires a **paid plan** (GitHub Pro for personal accounts, or Team/Enterprise for orgs). On the free tier, Pages works for **public** repos only.

If the repo stays private on a free account, CI still runs (lint, test, build), but the public `*.github.io` demo is not available unless you upgrade, make the repo public, or host Storybook elsewhere (Netlify, Vercel, Cloudflare Pages, self-hosted).

When Pages is enabled on a paid private repo, you can set visibility to **public** (anyone can view Storybook) or restrict access to people with repo access.

## `check-changeset`

The CI workflow runs `tools/ci/check-changeset.sh` on pull requests. It fails when no new `.changeset/*.md` was added for a user-visible change. Add the **`skip-changeset`** label to bypass (tests-only, docs-only, internal refactors).

## PR bots (coverage + test failures)

On pull requests, after tests finish:

- **`test-coverage-reporter`** posts or updates a single PR comment with coverage for changed files under `src/`.
- **`test-failure-notifier`** posts or updates a PR comment when tests fail.

Both jobs are best-effort (`continue-on-error: true`).

## Release and publish

1. Merge feature PRs to `main` (each with a changeset when user-visible).
2. Bump `package.json` version (manually, or via **Actions → Release** which runs `pnpm changeset version`, commits `chore(release): vX.Y.Z`, and tags).
3. Every push to `main` runs **Publish**. If that version is not yet on npm, it builds with **`ENV_PRODUCTION`**, publishes (**`NPM_TOKEN`**), optionally uploads webc to S3, and creates a GitHub Release from `CHANGELOG.md`. If the version is already published, the workflow skips cleanly.

### Repository secrets

| Secret                                                                                                 | Purpose                                        |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `NPM_TOKEN`                                                                                            | npm publish (`publish.yml`, `snapshot.yml`)    |
| `ENV_PRODUCTION`                                                                                       | Contents of production `.env` for `pnpm build` |
| `S3_REGION`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `VITE_S3_CDN_URL` | Web component CDN upload                       |

### Snapshot QA

Workflow **Publish snapshot** (manual): enter the PR number. It checks out that branch, runs `changeset version --snapshot pr-<n>`, builds, publishes to npm with dist-tag `pr-<n>`, and uploads webc. Consumers: `pnpm add noirium@pr-<n>`.

## Local parity

```sh
pnpm lint && pnpm format && pnpm typecheck && pnpm test run && pnpm build
pnpm build-storybook && npx serve storybook-static
```

## See also

- [Changesets](./changesets.md) — versioning
- [Conventions](./conventions.md) — post-change verification
- [Git conventions](./git-conventions.md) — commit format
