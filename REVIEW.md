# Review instructions

Injected verbatim into every Code Review agent. Project conventions live in `AGENTS.md` (single source of truth; `CLAUDE.md` defers to it) — violations default to Nit. This file only _recalibrates_ severity and scope for our repo.

## What Important means here

This is a published component library with a **dual-build output** (Vue library + standalone Web Components). Reserve 🔴 Important for findings that would break a consumer app, ship a broken webc bundle, or violate the public API contract. Everything else is Nit at most.

**Always Important** (promote from Nit if AGENTS.md also covers it):

- **Hardcoded `<Teleport to="body">` in a component that ships (or can ship) as a web component.** Must use `useTeleportTarget` and bind `:to="teleportTarget"`. Static `to` attributes escape the shadow DOM and lose all styles. Flag any `<Teleport>` with a static target in files that have a `.webc.ts` sibling or are transitively imported by one.
- **Popper/dropdown/tooltip without `positionFixed: true`** in a component reachable from a webc bundle. Inside Shadow DOM the offset parent is the shadow host — without `positionFixed` the panel renders in the wrong place.
- **Global CSS that escapes scoped SFC / shadow-DOM boundaries.** No new selectors targeting host-app elements, no unscoped `:root` / `body` / `html` rules introduced outside the opt-in `dist/lib/core.css` entrypoint. A style that "looks right in Storybook" can still break as a webc bundle.
- **Hand-edit of `package.json` version or `CHANGELOG.md`.** Both are owned by Changesets. Add `.changeset/*.md` via `pnpm changeset` and commit it alongside the code.
- **Missing changeset for a user-visible change.** New/changed/removed component, export, prop, slot, emit, or default behavior requires a `.changeset/*.md` in the PR. Internal refactors, test-only, tooling, and docs-only are exempt.
- **Direct `axios` / `redaxios` import in feature code.** All HTTP must go through `ApiService.{get,post,put,patch,delete}<T>()`. Narrow errors with `isAxiosError(err)`; surface user-facing strings via `extractApiErrorMessage(err)`.
- **Cross-feature import reaching past `features/<feature>/index.ts`.** Deep imports into another feature's internal paths (`features/other/components/...`, `features/other/lib/...`) break the barrel contract and the public API surface. Imports within the same feature are fine.
- **Contract selector targeting a class instead of `data-*`.** `*.contract.ts` files must select via `data-<component-kebab>-<role>` attributes. UnoCSS atomic classes are hashed in the webc production build, so class selectors silently break there.
- **`config.config` touched directly, or `axiosInstance` imported directly.** Read runtime config via `config.get('…')`; `config.set('apiBaseUrl', …)` transparently rebuilds the shared instance.
- **New runtime dependency without justification.** Every npm dep inflates every webc bundle that transitively includes it. An Important-severity finding when the addition is non-trivial and no alternative was considered in the PR description.
- **Invented user-facing copy.** New button labels, alert text, empty states, tooltips, placeholders, or ARIA labels added without a Figma spec or stakeholder wording. This is a shared library — filler copy propagates to every consuming app. Prefer a prop/slot with no default over a guessed string.
- **`any` or unchecked `as SomeType`.** TypeScript is strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`). Use `unknown` at boundaries and narrow. `import type` for type-only imports.
- **Public-export leak.** Internal helpers added to `src/entries/*.ts` (any subpath export). Only intentional public API goes into entry files.
- **`:root` not rewritten to `:host` in a new webc recipe.** The `adoptSharedWebComponentStyles` pattern depends on it. Always copy `PrimaryButton.webc.ts` as the template.

## Always check

- Every new component has a co-located `.test.ts` and `.stories.ts`; if exposed as a web component, also `.webc.ts` + `.webc.stories.ts` + a shared `.contract.ts` run from both stories.
- Every webc story's `play` starts with `assertWebcSmoke({ canvasElement, tag })`.
- Contract files test _observable output_ (text, ARIA, which elements exist) — not pixels/colors/font-sizes.
- Every network call in a new feature has an MSW handler factory under the feature's `lib/__mock__/index.ts` (and is registered in `src/mocks/node.ts`). No inline `http.*` handlers in `.stories.ts` or `.test.ts`.
- Every async/dialog overlay uses `defineAsyncComponent({ suspensible: false })` + `useLazyVisible()` + `<transition appear>` — the lazy-loaded recipe. Static-imported dialogs defeat code splitting.
- Every new public export is declared in the matching `src/entries/*.ts` file and the `package.json` exports map.
- Any webc-facing component using Popper confirms `positionFixed: true`.
- When AGENTS.md guidance becomes outdated because of a change in the PR, flag that AGENTS.md needs updating too.
- Conventional Commits + feature branch naming (`feat/<description>`, `fix/<description>`, `chore/…`) — flag deviations.
- Any new or changed Valibot schema/usage matches the patterns in `.agents/skills/valibot/SKILL.md` — functional API (`v.parse(schema, data)`, `v.safeParseAsync(...)`), pipelines via `v.pipe(...)`, wrappers like `v.optional`/`v.nullable`, no Zod-style chains (`.parse()`, `.optional()`, `.default()`, `.refine()`). Promote to Important if Zod-style usage leaks in.

## Cap the nits

Report at most **6 Nits** per review. If more exist, say "plus N similar items" in the summary. If everything found is Nit, lead the summary with "No blocking issues."

After the first review on a PR, suppress new Nits on subsequent runs — post Important findings only. A one-line fix should not reach round seven on style.

## Do not report

- Anything CI already enforces: `pnpm lint` (Oxlint type-aware), `pnpm format` (Oxfmt: quotes, commas, 100-char lines, import/class sort), `pnpm typecheck` (vue-tsc), `vp run task:pre-commit`, `vp run task:css:check`, Husky commit-msg (Conventional Commits).
- Generated or vendored files: `dist/`, `coverage/`, `node_modules/`, `pnpm-lock.yaml`, Storybook-built output, web-component compiled bundles.
- Test-only / story-only files intentionally relaxing production rules (MSW mock factories, test scaffolding).
- UnoCSS class-shortening artefacts in webc bundles — they're expected; only flag when a contract is actually broken by them.
- Missing tests, **unless** the edited file is outside the Vitest coverage exclusion list in `vite.config.ts`. If the file is covered, a missing test for a new behaviour is an Important (see "Always check" above); otherwise don't flag.
- Commit message style or PR size — Husky and team review already cover these.
- Version numbers in PR titles or summaries. Next version is computed at release from pending changesets; "I'll take 1.4.0" is the old workflow.

## Verification bar

- Behaviour claims (e.g. "this leaks styles across shadow roots", "this races") need a `file:line` citation or a reproduction path. Don't infer from naming alone.
- Before flagging a "wrong" color/spacing token, check `uno.config.ts` theme — tokens may already exist under a different name. Primary is `#171717`, text scale is `darker/dark/light`.
- Before flagging a missing composable/util as a gap, grep the `features/*/lib/` tree — barrel exports hide a lot.
- Before flagging a `<Teleport to="body">` as broken, confirm the file has a `.webc.ts` sibling _or_ is transitively imported by one. Pure-lib components with no webc exposure can keep `"body"` (but `useTeleportTarget` is still preferred for future-proofing — a Nit, not Important).
- For contract-test findings, verify the selector actually exists in the component's template — don't flag missing `data-*` hooks without checking whether the contract references them.

## Summary shape

Open the review body with a one-line tally: `N important, M nits` (or `No blocking issues` when there are zero Importants). Then a 1–3 sentence summary of the PR's intent as you understood it, followed by the findings table. The author should know the shape of the review before reading the details.

Callouts to include when relevant:

- **Dual-build impact:** if the change touches a component with a `.webc.ts` sibling, note whether `pnpm build:webc` and `pnpm test:stories` were expected to run. A lib-only change that breaks the webc build is the single biggest silent-regression risk in this repo.
- **Changeset status:** whether a `.changeset/*.md` is present or correctly omitted.
