#!/usr/bin/env bash
# Rebuild main: linear features + `pnpm exec changeset version` at each release.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BACKUP_BRANCH="${1:-backup-main-before-changelog-rewrite}"
START_SHA="${2:-3663995}"

if ! git rev-parse --verify "$BACKUP_BRANCH" >/dev/null 2>&1; then
  git branch -f "$BACKUP_BRANCH" HEAD
fi

CHANGELOG_HEADER="$(git show "$BACKUP_BRANCH:CHANGELOG.md" | head -7)"

pick() {
  local sha=$1
  echo ">> pick $(git log -1 --format='%s' "$sha")"
  if git cherry-pick "$sha"; then
    return 0
  fi
  git diff --name-only --diff-filter=U | while read -r f; do
    git checkout --theirs "$f" 2>/dev/null || git rm -f "$f" 2>/dev/null || true
  done
  git add -A
  git cherry-pick --continue --no-edit
}

release() {
  echo ">> changeset version"
  local current
  current=$(node -p 'require("./package.json").version')
  if [ "$current" = "0.0.0" ]; then
    node -e 'const p=require("./package.json");p.version="0.1.0";require("fs").writeFileSync("package.json",JSON.stringify(p,null,2)+"\n")'
  fi
  if [ ! -f playground/package.json ]; then
    node <<'NODE'
const fs = require('fs');
const path = '.changeset/config.json';
const cfg = JSON.parse(fs.readFileSync(path, 'utf8'));
cfg.ignore = (cfg.ignore || []).filter((x) => x !== 'playground');
fs.writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
NODE
  fi
  pnpm exec changeset version
  local v
  v=$(node -p 'require("./package.json").version')
  if [ ! -f CHANGELOG.md ] || ! grep -q 'Keep a Changelog' CHANGELOG.md 2>/dev/null; then
    {
      printf '%s\n\n' "$CHANGELOG_HEADER"
      tail -n +2 CHANGELOG.md
    } > CHANGELOG.md.tmp
    mv CHANGELOG.md.tmp CHANGELOG.md
  fi
  git add package.json CHANGELOG.md .changeset
  if [ -f pnpm-lock.yaml ]; then
    git add pnpm-lock.yaml
  fi
  git commit -m "chore(release): v${v}"
}

pick_without_changelog() {
  local sha=$1
  local parent
  parent=$(git rev-parse HEAD)
  echo ">> pick (no changelog) $(git log -1 --format='%s' "$sha")"
  if ! git cherry-pick --no-commit "$sha"; then
    git checkout --theirs . 2>/dev/null || true
  fi
  git checkout "$parent" -- CHANGELOG.md package.json .changeset
  git add -A
  git commit -C "$sha"
}

git checkout -B main "$START_SHA"

pick 1302b46
pick 1ccd175
pick 5b58e29
pick 17521d2
pick 128906b
pick ea62219
release

pick 78e9aeb
pick 5c9997b
release

pick e5cf91c
pick f7206b3
release

pick f3dc663
pick 910ded6
release

pick 5861b88
pick cba3830
pick db536cc
pick 2532a16
pick 502a5ca
pick 1f8e4af
pick_without_changelog 2aeae65
pick d7db742
pick a724c82
pick 4d08dfc
pick 4e91eee

echo ">> Done: $(git rev-parse --short HEAD)"
git diff --stat "$BACKUP_BRANCH" HEAD || true
