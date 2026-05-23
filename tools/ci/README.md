# CI scripts

Supporting scripts for local checks and GitHub Actions. Workflow definitions live in [`.github/workflows/`](../../.github/workflows/).

| Script | Purpose |
| ------ | ------- |
| `check-changeset.sh` | Fail PRs that lack a `.changeset/*.md` when required |
| `validate-output-css.sh` | CSS bundle validator (`pnpm css:check`) |
| `github-api.ts` | GitHub REST helpers for PR comments (used by reporters) |
| `test-coverage-reporter.ts` | Post per-PR coverage summary on pull requests |
| `test-failure-notifier.ts` | Notify PR when tests fail |
| `publish-webc.ts` | Upload `dist/webc` to S3/CDN (Bun) |
| `publish-flag-icons.ts` | Upload flag SVGs to S3/CDN (Bun, manual) |

## Workflows

| Workflow | File | Trigger |
| -------- | ---- | ------- |
| CI | `ci.yml` | PR + push to `main` |
| Deploy Pages | `storybook-pages.yml` | push to `main`, tags, manual |
| Release | `release.yml` | manual — `changeset version`, commit, tag |
| Publish | `publish.yml` | push tag `v*` — build, npm, webc CDN, GitHub Release |
| Publish snapshot | `snapshot.yml` | manual — prerelease for a PR number |

See [docs/content/ci.md](../../docs/content/ci.md) for setup and secrets.

## GitHub Pages (docs + Storybook)

- Docs: **[https://aminhadei.github.io/noirium/](https://aminhadei.github.io/noirium/)**
- Storybook: **[https://aminhadei.github.io/noirium/storybook/](https://aminhadei.github.io/noirium/storybook/)**

Local preview:

```sh
pnpm build-storybook
npx serve storybook-static
```

## Required repository secrets

| Secret | Used by |
| ------ | ------- |
| `NPM_TOKEN` | `publish.yml`, `snapshot.yml` |
| `ENV_PRODUCTION` | Full `.env` file content for production builds |
| `S3_REGION`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `VITE_S3_CDN_URL` | `publish-webc.ts` |

`GITHUB_TOKEN` is provided automatically for PR comments.
