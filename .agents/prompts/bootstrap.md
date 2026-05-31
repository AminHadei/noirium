# Bootstrap prompt — agent infrastructure

Paste this prompt into a fresh agent session (Claude Code, Cursor, Codex, Gemini CLI) at the root of a new repo. The agent will set up a documentation + skills + commands structure that:

- Keeps **one source of truth per topic** (no prose duplication).
- Serves **two audiences** without forking content: human developers (browsable docs site) and AI agents (Claude Code, Cursor, Codex CLI, Gemini CLI).
- Loads agent context **on demand** (skills, commands) rather than pre-loading everything.

The receiving agent is expected to inspect the target repo, adapt the recommendations to its actual stack (Vue, Nuxt, React, anything), and ask before making destructive changes.

---

## Prompt to give the agent

You are bootstrapping the agent-infrastructure for this repository. Read this entire file before acting. Then follow the steps in order. Ask before doing anything destructive (renaming existing files, overwriting non-empty files).

### Mental model

There are three layers of written guidance in this repo:

| Layer                              | Audience      | Loading                                    | Lives in                                                  |
| ---------------------------------- | ------------- | ------------------------------------------ | --------------------------------------------------------- |
| **Developer handbook**             | Humans        | Always (browsed)                           | `docs/` (served by VitePress / Docus / MkDocs / etc.)     |
| **Agent orientation + meta-rules** | All AI agents | Always loaded into agent context           | `AGENTS.md` at repo root, plus tool bridges               |
| **Skills and commands**            | All AI agents | On demand (description-match or path-glob) | `.agents/{skills,commands}/` (canonical) + per-tool shims |

The cardinal rule: **content lives once**. If two files contain the same prose, one of them must become a pointer.

### File layout to create

```
AGENTS.md                                ← cross-tool agent orientation (read by Codex, Cursor, Copilot, Gemini)
CLAUDE.md                                ← single line: @AGENTS.md  (Claude Code does not read AGENTS.md natively)
GEMINI.md                                ← optional: single line @AGENTS.md if Gemini support is wanted
REVIEW.md                                ← optional: agent-only review calibration if too large to inline

docs/                                    ← human-facing handbook (developer-readable, deployed to a docs site)
  index.md
  <topic>.md                             ← one file per cross-cutting topic
  decisions/                             ← ADRs for structural choices
  recipes/                               ← task-focused how-tos

.agents/                                 ← canonical, cross-tool source of truth
  skills/<name>/SKILL.md                 ← topic skills (loaded on description match)
  commands/<name>.md                     ← user-invoked procedures (slash commands)
  prompts/                               ← meta prompts like this file (optional)

.claude/                                 ← Claude Code shims
  skills/<name>/SKILL.md                 ← frontmatter + @-pointer to .agents/skills/<name>/SKILL.md
  commands/<name>.md                     ← frontmatter + @-pointer to .agents/commands/<name>.md

.cursor/                                 ← Cursor shims
  rules/<name>.mdc                       ← frontmatter + @-pointer to .agents/skills/<name>/SKILL.md
  rules/project.mdc                      ← always-apply orientation rule pointing at AGENTS.md + docs/
  commands/<name>.md                     ← frontmatter + @-pointer to .agents/commands/<name>.md
```

**Why this shape:**

- `AGENTS.md` is a cross-tool convention (Linux Foundation Agentic AI Foundation). Codex CLI, Cursor, Copilot, Gemini CLI, Aider, Windsurf, Devin all read it natively.
- Claude Code does **not** read `AGENTS.md` natively — it reads `CLAUDE.md`. The `@AGENTS.md` import bridges them with no duplication.
- `.agents/skills/` and `.agents/commands/` are read natively by Codex CLI and Gemini CLI.
- Claude Code reads `.claude/skills/` and `.claude/commands/`. Cursor reads `.cursor/rules/` and `.cursor/commands/`. These need shim files.
- Shims are tiny: each tool requires its own frontmatter shape (different fields), but the _body_ is one line pointing at the canonical file.

### Decision tree for new content

When the user asks to add a doc, rule, or procedure:

```
Is this content something humans will actively read in the docs site?
├── YES → it's a "shared" topic
│   1. Write docs/<slug>.md (terse, current-reality-only, no backstory)
│   2. Add to the docs site's sidebar config
│   3. Add a row to the doc table in AGENTS.md
│   4. If agents must actively follow it during specific tasks
│      (e.g. commit messages, doc edits, code reviews):
│      → also create a skill at .agents/skills/<name>/SKILL.md
│        whose body is a 2-line pointer to the docs/<slug>.md
│      → create per-tool shims in .claude/skills/ and .cursor/rules/
└── NO → it's agent-only
    1. Write .agents/skills/<name>/SKILL.md as the source of truth
    2. Create .claude/skills/<name>/SKILL.md as a shim
    3. Create .cursor/rules/<name>.mdc as a shim

Is this a user-invoked procedure (slash command)?
└── YES
    1. Write .agents/commands/<name>.md as source of truth (no frontmatter)
    2. Create .claude/commands/<name>.md as a shim with Claude frontmatter
    3. Create .cursor/commands/<name>.md as a shim with Cursor frontmatter
```

### Templates

#### `AGENTS.md` skeleton

```markdown
# AGENTS.md — agent orientation

Orientation for AI agents and automated code review on this repo. Claude Code reads it via `@AGENTS.md` in `CLAUDE.md`; Codex, Cursor, Copilot, Gemini CLI and other agents read it natively. Human developers read [`docs/`](./docs/content/index.md).

## Read the docs, not this file

Normative project rules live in `docs/`, one file per cross-cutting topic:

| Topic                         | Doc                                                                  |
| ----------------------------- | -------------------------------------------------------------------- |
| First run, commands, env vars | [docs/content/getting-started.md](./docs/content/getting-started.md) |
| Architecture                  | [docs/content/architecture.md](./docs/content/architecture.md)       |
| <add rows as topics emerge>   | …                                                                    |

**Consult the relevant doc(s) first when answering a question or doing a task. Don't paraphrase rules into prose that'll drift from the source.**

## Skills (loaded on demand)

Topic-specific guidance lives as skills in [`.agents/skills/`](./.agents/skills/) — single source of truth. Each agent discovers them through its native mechanism (Claude Code via shims in `.claude/skills/`, Cursor via shims in `.cursor/rules/`, Codex CLI and Gemini CLI auto-read `.agents/skills/` directly). Add new skills in `.agents/skills/<name>/SKILL.md` with thin pointer shims in the per-tool dirs.

## Agent-only rules

Meta-rules about how agents interact with this repo. Keep them terse, repo-specific, and universally applicable to every action — anything narrower belongs in a skill.

### 1. Never bypass hooks or `--no-verify`

If a pre-commit / commit-msg hook fails, fix the root cause. The hook is not the problem.

### 2. Never commit without confirmation

Don't run `git commit` unsolicited. When the user asks for a commit, follow [`docs/content/git-conventions.md`](./docs/content/git-conventions.md).

### 3. Action scope

- Local, reversible actions (edits, tests, builds) — proceed.
- Destructive, remote, or hard-to-reverse actions (force-push, `reset --hard`, amending pushed commits, package removals, DB migrations) — confirm first, every time.

### 4–N. Behavioral discipline (optional, repo's choice)

Add rules for "think before coding," "simplicity first," "surgical changes," "goal-driven execution" only if you want them always-loaded. Otherwise leave them as agent default behavior.

## When in doubt

Mirror an existing implementation:

- `<canonical example file 1>`
- `<canonical example file 2>`

If no precedent exists, raise in review and document the outcome in the right `docs/` file in the same PR.
```

#### `CLAUDE.md`

```
@AGENTS.md
```

#### `.agents/skills/<name>/SKILL.md` (canonical, with body)

```markdown
---
name: <kebab-case-name>
description: <third-person, lead with trigger keywords, ≤1024 chars, says WHAT and WHEN. e.g. "Use when editing files under docs/, writing or updating ADRs, or codifying a project convention. Enforces the rules for the docs/ tree — single source of truth, no duplication, no backstory in topic docs.">
---

# <Skill title>

<Body — the actual rules, OR a 2-line pointer to docs/<slug>.md if the rules belong in a developer-readable doc.>
```

#### `.claude/skills/<name>/SKILL.md` (shim)

```markdown
---
name: <same as canonical>
description: <same as canonical>
---

Read [`.agents/skills/<name>/SKILL.md`](../../../.agents/skills/<name>/SKILL.md) for the rules. That file is the single source of truth, shared with Codex CLI and Gemini CLI.
```

#### `.cursor/rules/<name>.mdc` (shim)

```mdc
---
description: <sentence form, same intent as canonical description>
globs:
  - <path globs to auto-attach this rule, e.g. "docs/**/*.md">
alwaysApply: false
---

Follow the <name> rules in @.agents/skills/<name>/SKILL.md. That file is the single source of truth, shared with Claude Code, Codex CLI and Gemini CLI.
```

Cursor activation modes:

- `alwaysApply: true` → always loaded.
- `globs:` populated → auto-attach when matching files are referenced.
- `description:` set, `globs:` empty → agent-requested (model decides from description).
- All empty → manual only (`@rule-name`).

#### `.agents/commands/<name>.md` (canonical, no frontmatter)

```markdown
# /<name> procedure

Source of truth for the `/<name>` command. Tool-specific command files (`.claude/commands/<name>.md`, `.cursor/commands/<name>.md`) are thin shims that point here.

<The actual procedure: numbered steps, decision points, don'ts.>
```

#### `.claude/commands/<name>.md` (shim)

```markdown
---
description: <one-line summary>
argument-hint: '[optional argument hint]'
---

Follow the procedure in @.agents/commands/<name>.md exactly. That file is the single source of truth, shared with Cursor and any other tool that grows a `<name>` command.
```

#### `.cursor/commands/<name>.md` (shim)

```markdown
---
description: <one-line summary>
---

Follow the procedure in @.agents/commands/<name>.md exactly. That file is the single source of truth, shared with Claude Code and any other tool that grows a `<name>` command.
```

#### `.cursor/rules/project.mdc` (always-apply orientation)

```mdc
---
description: Project orientation for all agents. Always apply.
globs:
  - "**/*"
alwaysApply: true
---

Agent orientation lives in [AGENTS.md](mdc:AGENTS.md) — read it first. Normative project rules live in [docs/](mdc:docs/content/index.md).

Topic-specific guidance is loaded on demand via [.cursor/rules/](mdc:.cursor/rules/) and the canonical bodies in [.agents/skills/](mdc:.agents/skills/) (shared with Claude Code, Codex CLI and Gemini CLI).

Commands: `<list the project's standard build/test/lint commands>`. Run `<lint && typecheck>` before finishing a task.
```

### Bootstrap checklist

Execute in order. Stop and ask if any step would overwrite existing non-trivial content.

1. **Detect the stack.** Read existing config files (`package.json`, `nuxt.config.*`, `vite.config.*`, `pyproject.toml`, etc.). Note the framework, the doc-site tooling (or absence), the test/lint commands, the commit-hook setup.

2. **Pick a docs-site tool** if none exists. For Vue/Nuxt repos: VitePress is the default — it's already MD-first, has a clean theme, supports search and Mermaid. For other stacks: match what the team already uses or recommend Docus/MkDocs/etc. Ask the user if uncertain.

3. **Create `docs/` skeleton:**
   - `docs/content/index.md` (homepage)
   - `docs/content/getting-started.md` (install, run, env vars)
   - `docs/content/architecture.md` (mental model — fill in as the user explains)
   - `docs/content/conventions.md` (review-enforced rules — start empty, grow over time)
   - `docs/content/decisions/index.md` (ADR log)
   - `docs/content/recipes/index.md` (task-focused how-tos)
   - Wire all of these into the docs-site sidebar.

4. **Create `AGENTS.md`** from the skeleton above. Fill in the doc table with whatever exists. Fill in _When in doubt_ with 2–4 canonical example files from the codebase.

5. **Create `CLAUDE.md`** with the single line `@AGENTS.md`. (And `GEMINI.md` if Gemini is in use.)

6. **Create initial skills** that almost every project benefits from:
   - **`doc-authoring`** — rules for writing in `docs/`: single source of truth, no backstory, ADRs for structural choices, conventions land in the same change as the motivating PR. Trigger: editing files under `docs/`. _Cursor: globs to `docs/\*\*/_.md`.\*
   - **`git-conventions`** — Conventional Commits format, scopes, no body, no AI attribution. Body is a pointer to a new `docs/content/git-conventions.md`. Trigger: about to run `git commit`.
   - **`code-review`** (only if `REVIEW.md` exists or the project has a substantive review rubric) — body points to `REVIEW.md`. Trigger: reviewing a PR/branch/diff.
   - For each skill: write the canonical `.agents/skills/<name>/SKILL.md`, then shims in `.claude/skills/<name>/SKILL.md` and `.cursor/rules/<name>.mdc`.

7. **Create initial commands** the team will reach for repeatedly:
   - **`/add-doc`** — the procedure for adding a new doc/rule/skill (write canonical at `.agents/commands/add-doc.md`, then shims).
   - **`/pr-review`** — read AGENTS.md + REVIEW.md (if present), diff against main, report. (Avoid the bare name `/review` if Claude Code's built-in `review` is in scope — it'll collide.)

8. **Set up commit hooks** if not already present:
   - Husky + `@commitlint/config-conventional` for commit-msg validation.
   - lint-staged for pre-commit format/lint.
   - Document the rules in `docs/content/git-conventions.md`.

9. **Verify:**
   - In Claude Code: start a fresh session, confirm the new skills and commands appear in the available list.
   - In Cursor: confirm `.cursor/rules/project.mdc` activates as Always.
   - Run the docs site dev server, confirm new pages render and the sidebar resolves.
   - Run the lint/typecheck/test commands, confirm they pass.

10. **Stop. Do not commit.** Summarize what was created and wait for the user to ask for a commit.

### Tool-specific notes

| Tool        | Reads natively                                                          | Skill format                                | Command format                                                     |
| ----------- | ----------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Claude Code | `CLAUDE.md`, `.claude/skills/`, `.claude/commands/`                     | YAML frontmatter (`name`, `description`)    | YAML frontmatter (`description`, `argument-hint`, `allowed-tools`) |
| Cursor      | `.cursor/rules/*.mdc`, `.cursor/commands/*.md`                          | MDC (`description`, `globs`, `alwaysApply`) | YAML frontmatter (`description`)                                   |
| Codex CLI   | `AGENTS.md`, `.agents/skills/`, `.codex/skills/`                        | Same SKILL.md format as Claude              | Less standardized — `.codex/prompts/` if needed                    |
| Gemini CLI  | `GEMINI.md` (or `AGENTS.md` shim), `.agents/skills/`, `.gemini/skills/` | Same SKILL.md format                        | `.gemini/commands/`                                                |

`.agents/` is the cross-tool convention stewarded by the Linux Foundation's Agentic AI Foundation. Putting canonical bodies there means Codex and Gemini get the actual content with no shim needed.

### Anti-patterns to refuse

- **Pasting the same prose into both `docs/` and a skill body.** One file is the source of truth; the other is a pointer.
- **Putting agent-only behavioral rules into the `docs/` handbook.** The published handbook is for humans; "think before coding" reminders pollute it.
- **Putting reference-only material into `.agents/skills/`.** Skills are for behavior the agent should follow when triggered, not encyclopedia entries.
- **Inlining everything into `AGENTS.md`.** Anthropic's guidance is to keep `CLAUDE.md`/`AGENTS.md` under ~200 lines for adherence. Push narrow/long content into skills.
- **Tool-specific files that duplicate each other.** If `.claude/commands/foo.md` and `.cursor/commands/foo.md` both contain the procedure, extract it to `.agents/commands/foo.md` and make the per-tool files point there.
- **Backstory in topic docs.** Write docs as if today is the first day. War stories belong in commit messages and ADRs.
- **`--no-verify` to escape a failing hook.** Fix the root cause.
- **Committing without explicit user confirmation.** Or with AI attribution trailers (`Co-Authored-By: …`, `Generated with …`, etc.).

### Reference layout in this repo

- `AGENTS.md` — orientation table + agent-only rules
- `CLAUDE.md` — one-line `@AGENTS.md` import
- `REVIEW.md` — review calibration at repo root
- `docs/content/` — developer handbook (VitePress)
- `.agents/skills/` — canonical skill bodies; `.claude/` and `.cursor/` are thin shims
