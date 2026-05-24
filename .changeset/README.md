# Changesets

Track user-visible changes for the next `noirium` release. Full guide: [docs/content/changesets.md](../docs/content/changesets.md).

## Add a changeset

```bash
pnpm changeset
```

Pick `patch` / `minor` / `major`, write a one-line consumer-facing summary, commit the generated `.changeset/*.md` file.

Skip for test-only, docs-only, CI-only, or internal refactors — add the **`skip-changeset`** label on the PR if CI asks.

## Release (maintainer, on `master`)

```bash
pnpm changeset version   # bump package.json + CHANGELOG, consume .changeset files
git commit -am "chore(release): vX.Y.Z"
git tag vX.Y.Z
pnpm build && npm publish
```

Do not hand-edit `package.json` version or `CHANGELOG.md`.

## Local consumer testing

```bash
pnpm build:lib && vp link    # in noirium
vp link noirium              # in consumer app
```
