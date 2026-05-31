# Conventions

Review-enforced rules in `noirium`. These are checked by `code-review` (skill + agent), enforced by lint where automatable, and otherwise verified by humans on every MR.

## Public API surface

`package.json` exports map:

- `noirium` → `src/entries/index.ts` — default export is a Vue plugin installer that registers components globally and accepts a `prefix` option.
- `noirium/ui` — components only.
- `noirium/utils`
- `noirium/integrations` — `ApiService`, `AxiosError`, error helpers.
- `noirium/types`
- `noirium/style.css`
- `noirium/web-components/*` — individual compiled web components.

When adding a new public export, update the matching `src/entries/*.ts` file. Internal helpers must not leak into entry files.

## TypeScript

Strict config (`tsconfig.json`) with `noUncheckedIndexedAccess`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`, `strict`, etc. Rules:

- **No `any`.** Use `unknown` at boundaries and narrow.
- **`import type`** for type-only imports (required by `verbatimModuleSyntax`).
- **Component props and emits** are typed inline via `defineProps<{...}>()` and `defineEmits<{ event: [payload] }>()`. Do not use the legacy array/object syntax.
- **Named exports** by default. Default exports are allowed for Vue SFCs, Storybook stories, and config files — everywhere else use named exports.
- **`@/`** resolves to `src/`.

## Cross-feature imports

Cross-feature imports must go through `features/<feature>/index.ts`. Do not reach into another feature's internal paths.

## User-facing copy

Never invent user-facing strings. Copy is part of the design contract. See [Components](./components.md) → _User-facing copy_.

## Post-change verification (mandatory)

After **any** code change — even a one-line edit — run the full verification pipeline before declaring work complete. These steps are not optional.

Two task-graph entries cover the verification pipeline:

```sh
vp run task:pre-commit   # vp staged — lint + format + cspell on staged files (husky pre-commit)
vp run task:pre-push     # task:css:check && task:test (heavy validation, husky pre-push)
```

Run `vp run task:pre-push` before declaring work complete — it chains the cached `task:css:check` (which itself depends on `task:build:lib`) and `task:test`. The individual steps below describe what the pipeline covers and when to run them standalone.

1. **Tests** — `vp run task:test` (cached on `src/**/*`) or `vp test` for watch mode. Every code change must be followed by a test run to confirm no side effects. A change that "looks fine in isolation" does not qualify as verified.
2. **Test coverage for the change** — if the file you edited is **not** excluded from coverage (see [Testing](./testing.md) → _Coverage_), you must add or update tests. Required, not optional, not deferred.
3. **Lint** — `vp lint .`. Fix all errors. Do not silence a rule to get past CI unless it is genuinely a false positive.
4. **Format** — `vp fmt . --check` (or `--write` to auto-fix).
5. **Spelling** — `pnpm spellcheck`. Project-specific terms go in [`.cspell/project-words.txt`](../../.cspell/project-words.txt).
6. **Type-check** — `pnpm typecheck`.
7. **CSS bundle check** — `vp run task:css:check` after any change that touches a `.vue` file, an SFC `<template>`, or UnoCSS-relevant strings. The task depends on `task:build:lib` and is cached on `dist/lib/core.css`, so it rebuilds the library automatically when needed and skips when nothing has changed. It detects utility classes that were accidentally compiled into the bundle. If it fails, the root cause is almost always a bare utility string that UnoCSS extracted when it should not have. Fix it with one of these, in order of preference:
   - Wrap the class list in the `:uno:` transformer prefix inside `<template>` so `transformerCompileClass` compacts it into a single class name instead of emitting every utility.
   - When the offending string lives in `<script>` (or any TS/JS context where UnoCSS cannot tell it is not meant as a runtime class), wrap the block in `@unocss-skip-start` / `@unocss-skip-end` comments so the extractor ignores it.
   - As a last resort, move the string out of UnoCSS's scanned content entirely.

   Never "fix" `task:css:check` by editing the validator script or loosening its patterns.

8. **Web-component build** — if the touched component has an associated `.webc.ts` (or is imported by one), run `vp run task:build:webc` and confirm the output still builds and renders correctly under Shadow DOM.
9. **Changeset** — if the change is user-visible (new/changed/removed export, prop, or behavior), run `pnpm changeset` and commit the generated `.changeset/*.md` file alongside the code. See [Changesets](./changesets.md).

Skip later steps only when they are clearly unrelated to the change (e.g. a `.md`-only edit can skip `task:css:check`, `task:build:webc`, and the changeset, but still requires lint/format).

## Hard boundaries

- **NEVER** install `vitest`, `oxlint`, `oxfmt`, or `tsdown` directly. They are wrapped by `vite-plus`. Upgrade via `vp upgrade`.
- **NEVER** import from `vite` or `vitest` directly — use `vite-plus` / `vite-plus/test`. See [Vite+](./vite-plus.md).
- **NEVER** use `npm` or `yarn`. Use `pnpm` (or `vp add` / `vp remove`).
- **NEVER** commit secrets, `.env` files, or Firebase credentials. `.env.example` is the contract.
- **NEVER** touch `dist/`, `coverage/`, or `node_modules/` — all generated.
- **NEVER** bypass git hooks with `--no-verify`. See [Git conventions](./git-conventions.md).
- **NEVER** edit `package.json` version or `CHANGELOG.md` by hand. Both are owned by Changesets — see [Changesets](./changesets.md).
- **NEVER** run `pnpm changeset version` or `pnpm changeset publish`. Maintainer-only release steps.
- **NEVER** pre-reserve a version number for an in-progress feature. The next version is computed at release time from pending changesets.
- **NEVER** write `<Teleport to="body">` (or any hardcoded string target) in a component that ships as a web component. Always use `useTeleportTarget` from `src/features/shared/composables/useTeleportTarget.ts` and bind `:to="teleportTarget"`. See [Web components](./web-components.md).
- **NEVER** change popper aliasing or shadow-DOM style injection in `tools/vite/build-webc.ts` without running `pnpm build:webc` and confirming the output still works.
- **NEVER** add new runtime dependencies without weighing the impact on every web-component bundle that will transitively include them.
- **ALWAYS** co-locate `.test.ts` and `.stories.ts` next to a new component.
- **ALWAYS** route cross-feature imports through `features/<feature>/index.ts`.
- **ALWAYS** run the full _Post-change verification_ pipeline before declaring a change complete.
- **ALWAYS** write tests for any edited file that is not matched by the Vitest or Sonar coverage exclusion lists.
- **ALWAYS** run `vp run task:css:check` after touching SFCs or UnoCSS strings; fix failures by using the `:uno:` prefix or by keeping the bare class out of UnoCSS's scanned content — never by loosening the validator.
- **ALWAYS** verify popper-based and Shadow-DOM-exposed components still render correctly in the web-component build when touched.
- **ALWAYS** add a changeset (`pnpm changeset`) for any user-visible change, and commit it with the code.

## See also

- [Components](./components.md) — folder shape, naming, lazy overlays, copy rules
- [Web components](./web-components.md) — dual-build pitfalls
- [Styling](./styling.md) — `:uno:`, theme tokens, CSS bundle validator
- [Testing](./testing.md) — coverage exclusions, validated workarounds
- [Vite+](./vite-plus.md) — toolchain rules
- [Changesets](./changesets.md) — versioning and release flow
