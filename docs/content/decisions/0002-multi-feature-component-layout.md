# 0002 — Multi-feature component layout

- **Status:** Accepted
- **Date:** 2026-06-29

## Context

Noirium historically shipped all UI from `src/features/shared/`. Vetro parity work adds dozens of components grouped by domain (`buttons`, `forms`, `feedback`, …). Keeping every new component in `shared/` obscures boundaries and makes the public barrel harder to navigate.

## Decision

- **Legacy components** (`PrimaryButton`, `Modal`, `DatePicker`, …) remain under `src/features/shared/` until a dedicated migration PR moves them.
- **New parity components** from Vetro land in domain features (`buttons`, `data-display`, `forms`, `feedback`, …) mirroring Vetro's grouping.
- `src/features/index.ts` re-exports `shared` plus each domain feature; `src/entries/ui.ts` re-exports from `src/features/index.ts`.
- Cross-feature imports go through feature `index.ts` barrels only.
- Overlapping components (e.g. `PrimaryButton` vs Vetro `Button`, `BaseBadge` vs `Badge`) **coexist** — no rename or removal in the parity track unless a follow-up ADR says otherwise.

## Consequences

- Enables incremental parity without a big-bang `shared/` split.
- Plugin registration auto-discovers Vue SFC exports from `noirium/ui` (same pattern as Vetro).
- Each new feature needs its own `index.ts`, tests, stories, and changeset when user-visible.

See [Component parity](../component-parity.md) for the execution checklist.
