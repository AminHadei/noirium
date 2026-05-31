---
name: changesets
description: Use when finishing a user-visible change in noirium, editing files under .changeset/, running pnpm changeset, or advising on bump types and the snapshot-publish flow. Loads the rules for what counts as user-visible, bump-type selection (patch/minor/major), the never-edit-package.json-version rule, the never-run-changeset-version rule, and the MR snapshot job.
---

# Changesets & versioning for noirium

The full rules — when to add a changeset, bump-type selection, the snapshot-on-MR flow, the master release flow, and the explicit "do not" list (no manual `package.json` version edits, no manual `CHANGELOG.md` edits, no `pnpm changeset version` from a developer machine) — live in [`docs/content/changesets.md`](../../../docs/content/changesets.md).

That doc is the source of truth. Read it before running `pnpm changeset`, editing a `.changeset/*.md` file, or telling the user what bump type to pick.
