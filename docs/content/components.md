# Components

Authoring conventions for components in `noirium`. For the dual-build (Vue library + Web Components) recipe, see [Web components](./web-components.md). For styling mechanics, see [Styling](./styling.md).

## Folder shape

Each component lives in its own directory under a feature's `components/`:

```
features/<feature>/components/<ComponentName>/
  <ComponentName>.vue            # SFC
  <ComponentName>.test.ts        # Co-located test (required for new components)
  <ComponentName>.stories.ts     # Storybook story (required for new UI)
  <ComponentName>.webc.ts        # Web-component wrapper (optional)
  <ComponentName>.webc.stories.ts # Pair to .stories.ts for webc mode (when .webc.ts exists)
```

The component is exported from `features/<feature>/index.ts`. Other features import through that file — never reach into another feature's internal paths.

## Naming

- **File name is PascalCase** and equals the directory name, SFC name, and default export (`PrimaryButton/PrimaryButton.vue`, never `primary-button.vue` or `primaryButton.vue`). The webc output is kebab-cased by the build — the source stays PascalCase.
- **Name after the duty, not the visual category.** `PhoneNumberInput`, `DatePicker`, `PrimaryButton` beat `Input`, `Picker`, `Button`. If a name could apply to five unrelated components — or only describes the visual shape — it's too generic. The reader of a parent template should know what the component does from its tag alone.

## SFC structure

- `<script setup lang="ts">` only. No Options API.
- Props and emits typed inline:
  ```ts
  defineProps<{ label: string; loading?: boolean }>();
  defineEmits<{ select: [id: string] }>();
  ```
- No legacy array/object syntax for props or emits.
- Default export is the SFC itself (Vue handles this automatically).
- Style: prefer UnoCSS utilities in the template; `<style scoped>` only when component-specific CSS is unavoidable. See [Styling](./styling.md).

## User-facing copy

- **Never invent user-facing strings** (button labels, alert text, empty states, tooltips, placeholders, ARIA labels) without a design or explicit wording from the stakeholder. Copy is part of the design contract — since this is a shared component library, filler copy propagates to every consuming app. Ask for the wording, or propose 2–3 options and let the stakeholder pick.
- Where copy must be configurable, expose it as a prop or slot with no default (or a deliberately neutral default agreed in review), rather than baking in guesses.
- If a Figma design exists, use its copy verbatim unless it's obviously wrong (typo, stale term) — then flag in review rather than silently "improve" it.

## Lazy-loaded dialogs and overlays

Dialogs, sidebars, and other overlays that are not visible on initial render must be code-split so their modules (and any transitive imports, network calls, or heavy deps) are not fetched until the user opens them.

Recipe:

1. Import the overlay with `defineAsyncComponent({ loader: () => import('…'), suspensible: false })` in its container.
2. Drive mount/visibility with `useLazyVisible()` from `@/features/shared/composables/useLazyVisible`:
   - `v-if="mounted"` on the overlay — becomes `true` on first open and stays `true`, so the chunk is fetched once and the instance is reused.
   - `v-model:visible="visible"` (or `:visible="visible"`) — drives the overlay's own enter/leave transitions.
3. The overlay's internal `<transition>` blocks must have `appear` set, otherwise the first enter animation is skipped (since `mounted` and `visible` flip in the same tick).
4. Any data fetching (e.g. `ApiService` calls that populate the overlay) belongs inside the `open()` handler, not at module scope or in `onMounted` of the container.

Reference implementation: `Modal.vue` with lazy-loaded custom layouts via `defineAsyncComponent`. Do not statically import a dialog/overlay SFC into a container just to render it conditionally — that defeats the split.

## Storybook stories

- One `<Component>.stories.ts` per component. Storybook 7+ format: `Meta` + `StoryObj` + `satisfies Meta<typeof Component>`, `tags: ['autodocs']`, at least one `Default` story.
- For network-touching components, declare MSW handlers per-story via `parameters.msw.handlers` — never inline `http.*` handlers in story files. See [Storybook & MSW mocking](./storybook-mocking.md).
- For components with a `.webc.ts`, also add `<Component>.webc.stories.ts` paired to the lib story. See [Web components](./web-components.md).

## See also

- [BaseBadge](./features/base-badge.md) — color variants and custom colors
- [Architecture](./architecture.md) — feature-first layout
- [Web components](./web-components.md) — dual-build recipe and pitfalls
- [Styling](./styling.md) — UnoCSS, theme tokens, `:uno:` prefix
- [Testing](./testing.md) — VTU2 patterns and validated workarounds
- [Storybook & MSW mocking](./storybook-mocking.md) — per-story handlers
