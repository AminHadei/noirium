---
name: component
description: Use when scaffolding a new component for noirium. Creates the standard folder structure (Vue SFC + co-located test + Storybook story, optionally a web-component wrapper) under src/features/<feature>/components/<Name>/, registers the export in the feature's index.ts, and follows the conventions in docs/content/components.md and docs/content/web-components.md.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash(ls *), Bash(cat *), Glob, Grep
---

You are scaffolding a new component in `noirium`. Read [`docs/content/components.md`](../../../docs/content/components.md) and (if `--webc` is passed) [`docs/content/web-components.md`](../../../docs/content/web-components.md) before generating any file — they are the source of truth for folder shape, naming, and the dual-build recipe.

## Arguments

```
/component <FeatureName>/<ComponentName> [--webc]
```

- `<FeatureName>`: typically `shared` for UI kit components, or a new feature name when adding a domain module.
- `<ComponentName>`: PascalCase name for the component.
- `--webc`: if present, also generate the web component wrapper.

Parse these from `$ARGUMENTS`. If `$ARGUMENTS` is empty or unclear, ask the user to provide the feature name and component name.

## Steps

### 1. Validate

- Confirm the feature directory exists at `src/features/<feature>/`. If it doesn't and it's a new feature, create the full feature structure (`components/`, `lib/`, `index.ts`).
- Confirm the component doesn't already exist.

### 2. Generate files

Create `src/features/<feature>/components/<ComponentName>/` with:

**`<ComponentName>.vue`**

- `<script setup lang="ts">` with `defineProps<>` and `defineEmits<>` stubs
- `<template>` with a root element and the component name as a CSS class
- No `<style>` block — use UnoCSS utilities in the template

**`<ComponentName>.test.ts`**

- Import from `vite-plus/test`
- Import `mount` from `@vue/test-utils`
- One `describe` block with a basic "renders correctly" test
- Use the prop-spy pattern from [docs/content/testing.md](../../../docs/content/testing.md) if the component emits events

**`<ComponentName>.stories.ts`**

- Storybook 7+ format: `Meta` + `StoryObj`
- `satisfies Meta<typeof ComponentName>`
- `tags: ['autodocs']`
- One `Default` story with basic args

**`<ComponentName>.webc.ts`** (only if `--webc` flag is present)

Follow the recipe in [docs/content/web-components.md](../../../docs/content/web-components.md). Copy `src/features/shared/components/PrimaryButton/PrimaryButton.webc.ts` as the template. Do not hand-roll style injection — always go through `adoptSharedWebComponentStyles`.

### 3. Register exports

- Add the component export to `src/features/<feature>/index.ts`
- If `--webc` is present, no extra registration needed (build script auto-discovers `.webc.ts`)

### 4. Report

List all created files and next steps:

- Run `vp test path/to/<ComponentName>.test.ts` to verify the test passes
- Run `pnpm storybook` to see the story
- If `--webc`, run `vp run task:build:webc` to verify the web component builds
- Remind to run `pnpm changeset` for the user-visible addition (see [docs/content/changesets.md](../../../docs/content/changesets.md))
