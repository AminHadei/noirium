# Decisions (ADRs)

Architecture Decision Records for `noirium`. Each ADR captures the _why_ behind a structural choice that isn't self-evident from reading the code and is likely to be re-litigated later.

ADRs are numbered sequentially, zero-padded to 4 digits, and never renumbered. When an ADR is superseded, flip its `Status` and link forward.

See the `doc-authoring` skill for when to write a new ADR.

## Index

- [0001 — Changesets for versioning](./0001-changesets-for-versioning.md) — Accepted, 2026-04-25

### Template

```markdown
# NNNN — <decision title>

- **Status:** Accepted | Superseded by [NNNN](./NNNN-…)
- **Date:** YYYY-MM-DD

## Context

What constraints or forces drove the decision.

## Decision

What we chose.

## Consequences

What this enables, what it forecloses, what we accept as the cost.
```
