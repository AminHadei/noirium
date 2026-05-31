# Git conventions

Branch naming, commit format, and what Husky enforces in `noirium`. Releases and changelogs are driven by Changesets — see [Changesets](./changesets.md).

## Branches

- **Main branch:** `main`. PRs target `main`. Do not commit to `main` directly.
- **Feature branches:** `feat/<short-description>`.
- **Chore branches:** `chore/<description>`.
- Do not amend or force-push shared branches. Create new commits.

## Commit format — Conventional Commits

Commit-msg hook (Husky) enforces [Conventional Commits](https://www.conventionalcommits.org/) via `@commitlint/config-conventional`. Required prefixes in use:

| Type       | When to use                                                |
| ---------- | ---------------------------------------------------------- |
| `feat`     | New component, new prop/slot/emit, new export, new utility |
| `fix`      | Bug fix                                                    |
| `chore`    | Tooling, deps, build config, non-user-visible plumbing     |
| `docs`     | Docs-only changes (this site, READMEs, comments)           |
| `test`     | Test-only changes                                          |
| `style`    | Formatting only — no logic change                          |
| `refactor` | Internal refactor with no behaviour change                 |

Examples:

```
feat(date-input): add disablePastAndToday prop
fix(date-picker): correct positioning inside shadow DOM
chore(deps): bump @vueuse/core to 14.2.1
docs(testing): document onClickOutside vueuse v14 quirk
```

### Subject and body

- **Subject:** terse, imperative, lowercase after the type. Reference the component or scope when it disambiguates (`feat(button): …`).
- **No body needed by default.** Use the body only when reviewers need context that isn't obvious from the diff. Keep it short.
- **No AI attribution trailers.** Don't include `Co-Authored-By: Claude …` or `Generated with …` lines.

## Changeset alongside the commit

Any user-visible change must include a `.changeset/*.md` file committed in the same branch. The CI `check-changeset` job blocks PRs missing one (use the `skip-changeset` PR label only when the change has zero consumer effect — internal refactor, tests, docs, CI, formatting). See [Changesets](./changesets.md) for bump-type rules.

## Husky hooks

- **pre-commit:** lint + format on staged files (lint-staged).
- **commit-msg:** Conventional Commits enforcement.

If a hook fails, **fix the root cause**. Do not bypass with `--no-verify`. The hook is not the problem — failing hooks catch real issues that would block CI later.

## See also

- [Changesets](./changesets.md) — bump types and release flow
- [Conventions](./conventions.md) — TypeScript and structural rules
- [CI](./ci.md) — `check-changeset`, lint, and the rest of the pipeline
