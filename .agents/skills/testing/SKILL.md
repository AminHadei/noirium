---
name: testing
description: Use when writing or editing test files (*.test.ts, *.contract.ts) for noirium, mounting components with @vue/test-utils v2, mocking with MSW, or hitting one of the known testing quirks (onClickOutside, child→parent emit propagation, vi.hoisted, mutable closures across template + composable). Loads the repo's testing conventions and the validated workarounds.
---

# Testing rules for noirium

Vitest setup, MSW conventions, the prop-spy pattern, and every validated workaround for VTU2 / vueuse v14 quirks live in [`docs/content/testing.md`](../../../docs/content/testing.md).

That doc is the source of truth. Read it before writing or editing any test that mounts a component, dispatches a click-outside, mocks an HTTP call, or asserts on an emitted event.
