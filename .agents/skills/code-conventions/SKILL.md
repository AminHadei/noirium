---
name: code-conventions
description: Use when editing TypeScript or Vue source files under src/, adding a new feature directory, exposing a public API entry, writing components/composables/utils, or making cross-feature imports. Loads the noirium conventions — feature-first layout, cross-feature import boundary, TypeScript strict rules (no any, import type, defineProps/defineEmits typed syntax, named exports), public-API entries, runtime-config facade, ApiService usage, lazy-loaded overlays, and user-facing-copy rules.
---

# Code conventions for noirium

The full conventions — feature directory shape, cross-feature import boundary, TypeScript strict rules, public-API entries, runtime-config facade (`config.get/set`), ApiService usage, the lazy-loaded-overlay recipe, and the user-facing-copy rule — live in [`docs/content/conventions.md`](../../../docs/content/conventions.md), with deeper specifics in [`docs/content/architecture.md`](../../../docs/content/architecture.md), [`docs/content/components.md`](../../../docs/content/components.md), and [`docs/content/api-patterns.md`](../../../docs/content/api-patterns.md).

Those docs are the source of truth. Read the relevant one before adding a new component, touching a feature's public surface, or wiring a new HTTP call.
