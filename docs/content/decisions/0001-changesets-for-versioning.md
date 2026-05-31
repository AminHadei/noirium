# 0001 — Changesets for versioning

- **Status:** Accepted
- **Date:** 2026-04-25

## Context

`noirium` is consumed by multiple downstream apps; every release has to be reviewable before merging and reproducible after. The previous workflow had developers reserve a version number (e.g. `1.4.0-rc`, `1.5.0-rc`) when a feature started. That created three recurring problems:

- **Cancelled features left gaps** in the version history.
- **Out-of-order merges** caused arguments about who got which number.
- **Staging / QA builds collided** with the real `latest` dist-tag because they shared the same version sequence.

## Decision

Adopt [Changesets](https://github.com/changesets/changesets) as the single mechanism for version selection and changelog generation:

- A `.changeset/*.md` file declares the bump type (`patch` / `minor` / `major`) and one consumer-facing summary line.
- Pending changesets accumulate on feature branches; the tool computes the next version at release time from the highest bump across all of them.
- Snapshots use disposable pre-release versions published under per-PR dist-tags so QA can install them without touching `latest`.
- `pnpm changeset version` and `pnpm changeset publish` are CI-only — never run locally.

Day-to-day rules and the full lifecycle live in [Changesets](../changesets.md).

## Consequences

- **Cancelled feature** → delete the `.changeset/*.md`. No drift, no skipped numbers.
- **Out-of-order merges** → the tool resolves the bump automatically; no manual coordination.
- **Staging builds** → MR-scoped dist-tags decouple QA from the real release sequence.
- **Cost:** one extra commit per user-visible change (the changeset file), and a `check-changeset` CI job that blocks PRs missing one. The `skip-changeset` PR label is the escape hatch for changes with no consumer effect.
