# /add-doc procedure

Source of truth for the `/add-doc` command. Tool-specific command files (`.claude/commands/add-doc.md`, `.cursor/commands/add-doc.md`) are thin shims that point here.

You are adding new written guidance to the `noirium` repo. Follow this exact decision flow.

## 1. Get the topic

If `$1` is set, treat it as the topic. Otherwise ask the user one question: _"What should this doc/skill cover, and is it for developers, agents, or both?"_ Then stop and wait.

## 2. Classify

Decide one of three categories:

- **Developer-only** — humans reading the [VitePress site](../../docs/) (architecture details, recipes, ADRs, format rules). Agents do not need it loaded.
- **Agent-only** — guidance only AI agents need (review calibration, doc-authoring discipline, prompt-style behavior). Belongs in `AGENTS.md` (always-on rules) or a skill body (contextual rules).
- **Both** — substantive content humans will read AND agents must follow during certain tasks. Lives in `docs/content/` and is surfaced to agents via a skill pointer.

If unsure, ask the user. Do not guess.

## 3a. Developer-only — create in `docs/content/` only

1. **Pick a slug.** Lowercase, hyphenated, in `docs/content/<slug>.md`. Match existing topic-doc style (terse, no backstory, current reality only — see the `doc-authoring` skill).
2. **Write the doc.** Follow the structure of nearby topic docs. Cite real code paths with `file:line` where helpful. Keep examples tight.
3. **Add it to the VitePress sidebar** in `docs/.vitepress/config.ts` under the most relevant section.

## 3b. Agent-only — write in `AGENTS.md` or a skill

1. **Always-on rule** (applies to every action — e.g. "never bypass hooks", action-scope guardrails) → add a numbered rule under _Agent-only rules_ in `AGENTS.md`. Keep it terse. If it grows past 4–5 lines, extract it to a skill instead.
2. **Contextual rule** (only fires when working on a specific kind of file or task) → write a skill at `.agents/skills/<name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <name>
   description: <third-person, lead with trigger keywords, ≤1024 chars, says WHAT and WHEN>
   ---
   ```
   Body: the actual rules. Then create per-tool shims (step 4).

## 3c. Both — `docs/content/` is the source of truth, skill is a pointer

1. Write `docs/content/<slug>.md` per 3a. Add to the sidebar.
2. Add a row to the doc table in `AGENTS.md`.
3. If agents must actively follow it during certain tasks (e.g. commit messages, doc edits, web-component work), create a skill — see step 4 — whose body is a 2-line pointer to the new `docs/content/<slug>.md`.

## 4. Create per-tool shims (when a skill exists)

1. **Canonical** at `.agents/skills/<name>/SKILL.md` — full frontmatter and body (or pointer body for category 3c).
2. **Claude shim** at `.claude/skills/<name>/SKILL.md` — same frontmatter, body is a one-line pointer:
   ```markdown
   Read [`.agents/skills/<name>/SKILL.md`](../../../.agents/skills/<name>/SKILL.md) for the rules. That file is the single source of truth, shared with Codex CLI and Gemini CLI.
   ```
3. **Cursor shim** at `.cursor/rules/<name>.mdc`:

   ```mdc
   ---
   description: <same as Claude description, sentence form>
   globs:
     - <optional path globs for auto-attach; omit if agent-requested only>
   alwaysApply: false
   ---

   Follow the <name> rules in @.agents/skills/<name>/SKILL.md. That file is the single source of truth, shared with Claude Code, Codex CLI and Gemini CLI.
   ```

   - Use `globs:` when the rule should auto-fire on certain paths (e.g. `docs/**/*.md` for `doc-authoring`, `**/*.test.ts` for `testing`, `**/*.webc.ts` for `web-components`).
   - Leave `globs:` empty for agent-requested-only (description-match), like `code-review` or `git-conventions`.

## 5. Verify

- Confirm Claude Code picks up new skills: a fresh session's available-skills list should include the new `name`.
- If you added a developer-facing doc, run `pnpm docs:dev` (or `vp run docs:dev`) and confirm VitePress builds and the sidebar entry resolves.
- Do not commit. Stop after writing, summarize what was created, and wait for the user to ask for a commit (per `AGENTS.md` → _Never commit without confirmation_).

## Don'ts

- Don't paste the same prose into both `docs/content/` and a skill body. Pick one source of truth and pointer-link from the other.
- Don't add agent-only behavioral rules into `docs/content/`. The published handbook is for humans.
- Don't add reference-only docs into `.agents/skills/`. Skills are for behavior the agent should follow when triggered, not encyclopedia entries.
- Don't create a shim if the source-of-truth file doesn't exist yet.
