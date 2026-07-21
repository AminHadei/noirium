# Changesets — Developer Wiki

> A complete, scenario-driven guide to using [Changesets](https://github.com/changesets/changesets) in `noirium`. If you only have 2 minutes, read **[TL;DR](#tldr)** and **[The full lifecycle](#the-full-lifecycle-feature--qa--main)**. If you hit something weird, jump to **[Scenarios & FAQ](#scenarios--faq)**.

---

## Table of contents

1. [TL;DR](#tldr)
2. [What Changesets is](#what-changesets-is)
3. [How it is wired into this repo](#how-it-is-wired-into-this-repo)
4. [Anatomy of a changeset file](#anatomy-of-a-changeset-file)
5. [Bump types — patch / minor / major](#bump-types--patch--minor--major)
6. [The full lifecycle (feature → QA → `main`)](#the-full-lifecycle-feature--qa--main)
7. [Multiple changesets on one PR](#multiple-changesets-on-one-pr)
8. [Customizing the changelog markdown](#customizing-the-changelog-markdown)
9. [Snapshot releases for QA](#snapshot-releases-for-qa)
10. [Maintainer release flow (`main` only)](#maintainer-release-flow-main-only)
11. [Scenarios & FAQ](#scenarios--faq)
12. [Cheat sheet](#cheat-sheet)

---

## TL;DR

| You did…                                           | You do…                                                                          |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| Made a user-visible change on a feature/sub branch | `pnpm changeset` → pick bump → write summary → **commit the file**               |
| Made several changes in one PR                     | Run `pnpm changeset` **once per logical change** (multiple `.md` files are fine) |
| Touched only tests, docs, CI, internal refactor    | **No changeset.** Add the `skip-changeset` PR label if CI complains              |
| Need QA to test in a consumer app                  | `pnpm build:lib` + `vp link`, or publish a prerelease to npm manually            |
| QA rejected → push more commits                    | Add **another** `pnpm changeset` if the new commits are user-visible             |
| QA approved → ready to merge to `main`             | Merge the PR. Maintainer cuts the real release                                   |

Never edit `package.json` `version` or `CHANGELOG.md` by hand. Never run `changeset version` or `changeset publish` yourself.

---

## What Changesets is

A **changeset** is a tiny markdown file you commit alongside your code. It declares:

1. **How big** the change is — `patch`, `minor`, or `major` (semver).
2. **What the changelog should say** — one human-readable sentence.

At release time, the tool:

- Reads every pending `.changeset/*.md` file.
- Picks **one** new version number (the highest bump across all of them).
- Writes/extends `CHANGELOG.md` with all the summaries grouped under that version.
- Bumps `package.json`.
- Deletes the consumed `.md` files.

The choice between Changesets and hand-picked versions, and what each tradeoff buys, is recorded in [ADR 0001 — Changesets for versioning](./decisions/0001-changesets-for-versioning.md).

---

## How it is wired into this repo

| File / location                                                              | Purpose                                                                                                                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [.changeset/config.json](../../.changeset/config.json)                       | Changesets config. `baseBranch: main`, `access: restricted`, snapshot uses `{tag}-{timestamp}`, `playground` package is ignored.                                       |
| [.changeset/README.md](../../.changeset/README.md)                           | Quick-reference version of this guide (kept in sync).                                                                                                                  |
| [.changeset/\*.md](../../.changeset/)                                        | Pending changesets waiting for the next release.                                                                                                                       |
| [tools/changesets/new-changeset.sh](../../tools/changesets/new-changeset.sh) | Thin wrapper invoked by `pnpm changeset` (passes through to the CLI).                                                                                                  |
| `package.json` scripts                                                       | `changeset` (wrapper), `changeset:version`, `changeset:publish`, `changeset:status`.                                                                                   |
| GitHub Actions                                                               | `check-changeset` on PRs; **Release** workflow (`changeset version` + tag); **Publish** on push to `main` when the version is new on npm; **Publish snapshot** for QA. |

### Branch naming convention

`feat/<short-description>` or `fix/<short-description>`. Keep names readable — they show up in PR lists and release notes context.

---

## Anatomy of a changeset file

A changeset is YAML frontmatter + freeform markdown body:

````md
---
'noirium': minor
---

PrimaryButton: add `loading` prop that shows a spinner and disables clicks.```

- **Frontmatter** — one line per package being bumped, mapped to bump type. We only have one publishable package (`noirium`), so it's always a single line. `playground` is ignored.
- **Body** — what lands in `CHANGELOG.md`. Plain markdown. One sentence by default; can be richer (see [Customizing the changelog markdown](#customizing-the-changelog-markdown)).
- **Filename** — auto-generated whimsical name (`silly-llamas-jump.md`). Don't rename it; nothing depends on it being meaningful.

---

## Bump types — patch / minor / major

| Bump      | When to use                                                                                                                          | Example                                               | Version effect  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | --------------- |
| **patch** | Bug fix, perf tweak, dependency bump with no consumer-visible behavior change, internal-only refactor that we _do_ still want noted. | `DateInput: fix click-outside firing on first render` | `1.4.0 → 1.4.1` |
| **minor** | New component, new prop / slot / emit / event, new export, new utility — **backwards compatible**.                                   | `DatePicker: add disablePastAndToday prop`            | `1.4.0 → 1.5.0` |
| **major** | Removed/renamed a public export, changed a default, required a consumer migration, dropped Vue/Node support.                         | `Remove deprecated LegacyButton; replace with Button` | `1.4.0 → 2.0.0` |

### Decision rule of thumb

> Could a consumer upgrade **without reading any release notes** and have nothing break? `patch` or `minor`. Otherwise `major`.

> Did I add new public surface area? `minor`. Did I only fix or polish existing surface? `patch`.

### Bumps stack but don't sum

Three `patch` changesets in one release = **one** patch bump (`1.4.0 → 1.4.1`), not three. The highest bump across all pending files wins. Two `patch` + one `minor` = one `minor`. Any single `major` anywhere = `major`. The changelog still lists every individual entry under that one version.

---

## The full lifecycle (feature → QA → `main`)

Typical flow for a user-visible change:
````

main
│
├──◄── feat/my-feature (your branch — PR into main)
└──◄── fix/qa-feedback (follow-up PR if QA rejects)

````

### Step 1 — Write code and add a changeset

```bash
git checkout -b feat/add-loading-state
# ... write code, write tests ...
pnpm changeset           # interactive: pick bump, write summary
git add .changeset/*.md src/...
git commit -m "feat(button): add loading prop"
````

> If the branch is **only** tests/docs/CI/internal refactor, **skip** the changeset. The CI job will fail; add the `skip-changeset` label to the PR and re-run.

### Step 2 — Open a PR and get review

The `check-changeset` CI job ensures one exists (or that `skip-changeset` is set). Merge when approved.

### Step 3 — QA in a consumer app (optional)

Before merge, QA can test via `pnpm build:lib && vp link` in this repo and `vp link noirium` in the consumer. For registry-based QA, see [Snapshot releases for QA](#snapshot-releases-for-qa).

### Step 4 — Merge to `main`

All accumulated `.changeset/*.md` files travel with the merge. A maintainer runs [Maintainer release flow](#maintainer-release-flow-main-only).

### Where each changeset lives at each step

| Stage                               | `.changeset/*.md` files | `CHANGELOG.md`       | `package.json` version |
| ----------------------------------- | ----------------------- | -------------------- | ---------------------- |
| Branch in progress                  | accumulating            | unchanged            | unchanged              |
| Merged to `main`                    | accumulating            | unchanged            | unchanged              |
| Maintainer runs `changeset version` | **deleted**             | new section appended | bumped                 |
| npm publish                         | —                       | committed            | committed and tagged   |

---

## Multiple changesets on one PR

Common and encouraged. Run `pnpm changeset` once per **logically separate** change. You'll end up with several files in `.changeset/`:

```
.changeset/
  silly-llamas-jump.md       # patch — DateInput click-outside fix
  brave-otters-paint.md      # minor — DatePicker disablePastAndToday prop
  lazy-koalas-sing.md        # patch — formatDuration sub-minute handling
```

At release, the tool picks **one** version (the highest bump — here `minor`) and the changelog gets all three bullets under that one version heading. You don't need to merge them yourself.

### When to merge vs. split

| Situation                                | Recommendation                                 |
| ---------------------------------------- | ---------------------------------------------- |
| Two unrelated bug fixes on the same PR   | Two changesets                                 |
| One feature implemented across 5 commits | **One** changeset                              |
| One feature + an unrelated drive-by fix  | Two changesets                                 |
| Refactor + the bug fix it enables        | One changeset (describe the user-visible part) |

---

## Customizing the changelog markdown

The body of a changeset is **plain markdown**. Whatever you write lands verbatim under that version's heading in `CHANGELOG.md`. You are not limited to one sentence — use the full markdown toolkit when it actually helps the reader.

### Default (one-liner, the 90% case)

````md
---
'noirium': minor
---

PrimaryButton: add `loading` prop.```

### Multi-line summary with detail

```md
---
'noirium': minor
---

PrimaryButton: add `loading` prop.
Shows a spinner and disables click handling while truthy. Aria-busy is set
automatically. Works in both library and web-component builds.
```
````

### Bullet list (multiple sub-points under one entry)

```md
---
'noirium': minor
---

DatePicker overhaul.

- New `disablePastAndToday` prop.
- New `positionFixed` option, on by default in the web-component build for
  shadow-DOM compatibility.
- Click-outside now requires both `pointerdown` and `click` (vueuse v14).
```

### Tables (e.g. prop migration matrices)

```md
---
'noirium': major
---

Button: rename props for consistency.
| Before | After | Notes |
| ----------- | --------- | ------------------------------------- |
| `isLoading` | `loading` | Boolean, same behavior |
| `kind` | `variant` | `'primary' \| 'secondary' \| 'ghost'` |
| `onTap` | `@click` | Use the standard Vue listener |
```

### Code blocks (migration snippets, before/after)

````md
---
'noirium': major
---

Drop `LegacyButton`; use `Button` with `variant="legacy"`.

```vue
<!-- Before -->
<LegacyButton @tap="save">Save</LegacyButton>

<!-- After -->
<Button variant="legacy" @click="save">Save</Button>
```
````

### Headings (use sparingly)

You **can** use `###` headings inside the body, but they collide with the auto-generated version heading. Prefer **bold lead-ins** instead:

```md
---
'noirium': minor
---

DateInput: improve accessibility.
**Added**

- `aria-describedby` wired to the helper text slot.
- Keyboard navigation between input and popover.

**Fixed**

- Screen reader no longer announces the icon button as "unlabeled".
```

### Rules of thumb for good changelog entries

- **Lead with the component / area**, then a colon, then the imperative verb. (`DatePicker: add …`, not `Added a thing to DatePicker`.)
- **Write for the consumer**, not the implementer. They don't care that you refactored the internal store.
- **Keep the first line short** — many tools (Slack release bots, GitHub release notes) only show the first line.
- **Put detail underneath**, separated by a blank line.
- **Don't reference internal PR/commit IDs** unless you link them in the body — bare IDs rot.
- **Avoid emoji** unless the user has explicitly asked for them in this codebase.

---

## Snapshot releases for QA

Snapshots let QA test work **before** merging to `main`, without burning a real version number.

### Triggering

In GitHub: **Actions → Publish snapshot → Run workflow**, enter the PR number. The workflow checks out the PR branch, snapshots the version, builds, publishes to npm, and uploads webc.

Locally (same steps):

1. `pnpm changeset version --snapshot pr-<PR_NUMBER>`
2. `pnpm build`
3. `npm publish --tag pr-<PR_NUMBER> --ignore-scripts --no-git-checks`

### Consuming

In the downstream project:

```bash
pnpm add noirium@pr-1234      # pin the dist-tag
pnpm update noirium           # pull the latest snapshot of that tag
```

For web components loaded from CDN, point your `<script type="module">` at the snapshot path printed in the job log.

### What snapshot does NOT touch

- `package.json` on `main` (the snapshot bump is not committed unless you choose to).
- `CHANGELOG.md`.
- The `latest` dist-tag.
- The `.changeset/*.md` files in the repo (they're consumed only in the ephemeral CI workspace).

So you can publish 50 snapshots; none of them affect the next real release.

### Re-triggering

Re-run the workflow for each build you want to publish. Each run produces a new timestamped version under the same `pr-<number>` dist-tag. Old snapshots stay on the registry, but `pnpm update noirium` always pulls the newest one matching the tag.

### When the PR is closed without merge

Do nothing. The dist-tag `pr-1234` becomes orphaned and harmless. The next real release continues from wherever `latest` was. No version numbers are wasted.

---

## Maintainer release flow (`main` only)

> **Maintainers only.** After feature PRs merge to `main`:

### Cutting a release (automated)

1. Confirm `main` has every PR you want to ship (each with its changeset merged).
2. **Actions → Release → Run workflow** — runs `pnpm changeset version`, commits `chore(release): v<version>`, pushes `main` and tag `v<version>`.
3. The push to `main` triggers **Publish** — if that version is not on npm yet: production build, `npm publish`, optional webc CDN upload, and a GitHub Release with notes from `CHANGELOG.md`.

Configure repository secrets first — see [CI](./ci.md#release-and-publish).

### Cutting a release (manual fallback)

Bump `package.json` / `CHANGELOG.md` on `main` (or merge a release PR). **Publish** runs on the push and ships any version that is not already on npm. You can also run **Publish** manually via `workflow_dispatch`.

---

## Scenarios & FAQ

### "I forgot to add a changeset and the PR pipeline is failing."

Either:

- Run `pnpm changeset` locally, commit, push. CI re-runs. **Or**
- If the change truly has no consumer effect, add the `skip-changeset` label to the PR and re-run the `check-changeset` job.

### "I added the wrong bump type / typo in the summary."

The changeset is just a markdown file under `.changeset/`. Open it, edit the frontmatter or body, commit again. No special command. Nothing has been released.

### "I need to delete a changeset."

`rm .changeset/the-file.md && git commit`. Safe at any point before a maintainer runs `changeset version`.

### "QA rejected my snapshot. Do I need a new changeset for the fix?"

Usually **no** — if the fix is to unreleased-yet work, just edit the existing changeset's body to describe the final shipped behavior. Add a new changeset only if:

- The fix introduces additional user-visible behavior beyond what the original changeset described, **or**
- You want it to appear as a separate bullet in the changelog for clarity.

### <a id="editing-an-existing-changeset"></a>"How do I edit an existing changeset?"

Open `.changeset/<filename>.md` in your editor. Edit. Commit. That's it.

### "I need to bump only `playground` / a sub-package."

`playground` is in the `ignore` list in `.changeset/config.json` and is never published. You don't write changesets for it.

### "I added a feature on the feature branch but two sub-branches each added their own changeset for the same thing."

Delete one. Or, if both describe distinct user-facing aspects, leave both — they'll appear as two bullets under the same released version. Duplicates won't break anything except the changelog readability.

### "I want my entry to appear under a specific section like `### Added` / `### Fixed`."

Our config uses the **default** `@changesets/cli/changelog` formatter, which groups entries by **version + bump type**, not by Keep-A-Changelog sections. To get section-like grouping inside a single entry, use bold lead-ins (see [Headings](#headings-use-sparingly)).

### "Can I publish from my machine?"

**No.** Never run `pnpm changeset publish` or `pnpm changeset:version` locally. Use the **Release** and **Publish** workflows on GitHub (or let tag push trigger publish after a maintainer-cut release).

### "I need to reference another MR / issue in the changelog."

Use a markdown link in the body:

```md
---
'noirium': patch
---

DatePicker: fix shadow-DOM positioning regression.
See [PR #456](https://github.com/AminHadei/noirium/pull/456) for the
underlying Popper.js workaround.
```

### "Snapshot job published, but the consumer can't find the version."

- Confirm the consumer is authed against the npm registry you publish to (`npm registry=…` in `.npmrc`).
- Confirm you used the correct dist-tag: `pr-<number>`, not `latest`.
- Run `pnpm view noirium dist-tags` to see what's published.

### "I'm doing a hotfix on `main`, not on a feature branch."

Same flow: cut a `fix/…` branch off `main`, add a `patch` changeset, PR back into `main`. The maintainer will release it as the next patch version.

### "My PR is purely a refactor but I want a changelog mention anyway (`internal:` style)."

Add a `patch` changeset and start the summary with `Internal:` or `Refactor:` — the consumer will know it's not actionable for them. Use sparingly; the point of skipping is to keep the changelog noise-free.

### "Two PRs on the same release both add a `major` change. Do they multiply?"

No. The release is one bump regardless of how many `major` changesets it contains. All summaries appear under that one major version.

### "Can I use the same changeset across multiple PRs?"

No — each `.changeset/*.md` lives in **one** branch's commits. If two PRs touch the same area, each writes its own changeset; they merge naturally because the filenames are random.

---

## Cheat sheet

```bash
# Add a changeset (interactive)
pnpm changeset

# See what's pending and what the next version would be
pnpm changeset:status

# Edit a pending changeset
$EDITOR .changeset/<file>.md

# Drop a pending changeset
rm .changeset/<file>.md

# Maintainer release on main
# pnpm changeset version
# pnpm build && pnpm changeset publish
```

| Need                        | Command / action                                                             |
| --------------------------- | ---------------------------------------------------------------------------- |
| New changeset               | `pnpm changeset`                                                             |
| Inspect pending             | `pnpm changeset:status`                                                      |
| Snapshot for QA             | `pnpm changeset version --snapshot pr-<N>` + publish (manual; see above)     |
| Skip changeset legitimately | Add `skip-changeset` label to the PR, re-run CI                              |
| Edit / delete               | Just edit / `rm` the `.md` file and commit                                   |
| See past releases           | [CHANGELOG.md](../../CHANGELOG.md)                                           |
| Config                      | [.changeset/config.json](../../.changeset/config.json)                       |
| Wrapper script              | [tools/changesets/new-changeset.sh](../../tools/changesets/new-changeset.sh) |

---

**Maintainer note:** keep this wiki and [.changeset/README.md](../../.changeset/README.md) in sync. The short README is the in-repo elevator pitch; this file is the long-form reference.
