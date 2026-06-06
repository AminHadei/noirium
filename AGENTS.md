# AGENTS.md — agent orientation

This file orients AI agents and automated code review on the **Noirium UI** (`noirium`) repo. Claude Code reads it via a one-line `@AGENTS.md` import in `CLAUDE.md`; Codex, Cursor, Copilot, Gemini CLI and other agents read it natively. Human developers read [`docs/`](./docs/content/index.md) — every project rule lives there.

## Read the docs, not this file

All normative rules for humans and agents live in `docs/`. Cross-cutting topics, one file each:

| Topic                                                                                     | Doc                                                                      |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| First run, commands, env, the project task graph                                          | [docs/content/getting-started.md](./docs/content/getting-started.md)     |
| Mental model, dual distribution, directory layout, entry layer                            | [docs/content/architecture.md](./docs/content/architecture.md)           |
| Component folder shape, naming, lazy overlays, user-facing copy                           | [docs/content/components.md](./docs/content/components.md)               |
| Modal — built-in layouts, custom layouts, `useModalContext`, `createTypedModal`           | [docs/content/features/modal.md](./docs/content/features/modal.md)       |
| Web-component build, Shadow-DOM style injection, dual-build pitfalls, `useTeleportTarget` | [docs/content/web-components.md](./docs/content/web-components.md)       |
| UnoCSS wind4, theme tokens, `:uno:` prefix, `task:css:check`                              | [docs/content/styling.md](./docs/content/styling.md)                     |
| `ApiService`, runtime config facade                                                       | [docs/content/api-patterns.md](./docs/content/api-patterns.md)           |
| Storybook + MSW handler factories per feature                                             | [docs/content/storybook-mocking.md](./docs/content/storybook-mocking.md) |
| Vitest setup, MSW, VTU2 quirks, validated workarounds                                     | [docs/content/testing.md](./docs/content/testing.md)                     |
| `vp` CLI, pitfalls, `vite-plus/test` import path                                          | [docs/content/vite-plus.md](./docs/content/vite-plus.md)                 |
| Public API, TypeScript rules, post-change verification, hard boundaries                   | [docs/content/conventions.md](./docs/content/conventions.md)             |
| Conventional Commits, branch naming, Husky hooks                                          | [docs/content/git-conventions.md](./docs/content/git-conventions.md)     |
| Changesets — bump types and release flow on `main`                                        | [docs/content/changesets.md](./docs/content/changesets.md)               |
| GitHub Actions — CI and Storybook Pages                                                   | [docs/content/ci.md](./docs/content/ci.md)                               |
| ADR log — why a structural choice is shaped the way it is                                 | [docs/content/decisions/index.md](./docs/content/decisions/index.md)     |
| Task-focused how-tos                                                                      | [docs/content/recipes/index.md](./docs/content/recipes/index.md)         |

**When answering a developer question or performing a task, consult the relevant doc(s) first. Don't invent rules that aren't written down; don't paraphrase rules into prose that'll drift from the source.**

## Skills (loaded on demand)

Topic-specific guidance lives as skills in [`.agents/skills/`](./.agents/skills/) — the single source of truth. Each agent discovers them through its native mechanism (Claude Code via shims in [`.claude/skills/`](./.claude/skills/), Cursor via shims in [`.cursor/rules/`](./.cursor/rules/), Codex CLI and Gemini CLI auto-read `.agents/skills/` directly), so the body loads only when relevant. Add new skills in `.agents/skills/<name>/SKILL.md` and create thin pointer shims in `.claude/skills/` and `.cursor/rules/`.

## Agent-only rules

These are meta-rules that live _here_ because they're about how agents (including automated code review) interact with the repo. They don't belong in developer-facing docs.

### 1. Never bypass hooks or `--no-verify`

Husky (pre-commit lint-staged, commit-msg Conventional Commits) is load-bearing. Don't bypass. If a hook fails, fix the root cause — the hook is not the problem.

### 2. Never commit without confirmation

Don't run `git commit` unsolicited. When the user asks for a commit, follow the format in [`docs/content/git-conventions.md`](./docs/content/git-conventions.md) (loaded automatically via the `git-conventions` skill).

### 3. Action scope

- Local, reversible actions (edits, tests, builds, mock data resets) — proceed.
- Destructive, remote, or hard-to-reverse actions (force-push, `reset --hard`, amending pushed commits, package removals, npm publishes, CDN deploys) — confirm first, every time. A previous approval of one destructive action doesn't generalize to others.

### 4. Think before coding

Don't assume; don't hide confusion; surface tradeoffs.

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what's confusing, and ask.

### 5. Simplicity first

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you wrote 200 lines and it could be 50, rewrite it.

Sanity check: would a senior engineer call this overcomplicated? If yes, simplify.

### 6. Surgical changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that _your_ changes orphaned. Don't remove pre-existing dead code unless asked.

The test: every changed line traces directly to the user's request.

### 7. Goal-driven execution

Define success criteria up front; loop until verified.

- "Add validation" → write tests for invalid inputs, then make them pass.
- "Fix the bug" → write a test that reproduces it, then make it pass.
- "Refactor X" → ensure tests pass before and after.

For multi-step tasks, state a brief plan with a verification check per step. Strong success criteria let you loop independently; weak criteria ("make it work") force constant clarification.

## Code review

Severity calibration for automated review (which conventions escalate to Important, the nit cap, the skip list, the verification bar, the summary shape) lives in [`REVIEW.md`](./REVIEW.md) at the repo root. Conventions in `docs/` default to Nit unless `REVIEW.md` promotes them. The `code-review` skill loads `REVIEW.md` on demand.

## When in doubt

Mirror an existing implementation:

- `src/features/shared/components/PrimaryButton/PrimaryButton.vue`
- `src/features/shared/components/PrimaryButton/PrimaryButton.webc.ts` — canonical webc wrapper
- `src/features/shared/components/DateInput/DateInput.vue` + `.test.ts`
- `src/features/shared/lib/services/api.service.ts`

If no precedent exists, raise in review and document the outcome in the right `docs/` file in the same PR (the `doc-authoring` skill enforces this).
