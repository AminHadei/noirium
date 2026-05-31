---
name: doc-authoring
description: Use when editing files under docs/content/, writing or updating ADRs in docs/content/decisions/, or proposing/codifying a new project convention agreed in chat or review. Enforces the noirium rules for the docs/content/ tree — single source of truth, no duplication, no backstory in topic docs, ADRs for structural choices, and conventions land in the same change as the motivating PR.
---

# Doc-authoring rules for noirium

These rules apply when you are editing anything under `docs/content/`, writing an ADR, or codifying a new convention into the developer handbook. They are stricter than general writing because the handbook is the single source of truth — drift here breaks every contributor downstream.

## 1. `docs/content/` is the single source of truth

If a rule or explanation needs to appear in more than one place, it lives **once** in a dedicated `docs/content/<topic>.md` and every other mention links to that file. Don't paste paragraphs into two files — duplicated prose drifts, one side gets rewritten, the other silently lies.

When a new rule starts to repeat across docs, extract it into its own file in the same PR.

## 2. Classify before writing

Every new piece of guidance is one of three categories. Decide first, then write:

- **Developer-only** (humans browsing the VitePress site) → write in `docs/content/<slug>.md`. Don't surface to agents.
- **Agent-only** (rules only AI agents need — review calibration, doc-authoring discipline, prompt-style behavior) → put it in `AGENTS.md` (if it applies to every action) or a skill body in `.agents/skills/<name>/SKILL.md` (if it triggers contextually).
- **Both** → write the canonical content in `docs/content/<slug>.md`, add a row to the AGENTS.md doc table, and (if agents must actively follow it during certain tasks) create a skill whose body is a 2-line pointer to the doc.

Ask the user if uncertain. Do not guess.

## 3. Every convention agreed gets written down in the same change

A convention that only lives in a chat transcript or a PR comment is invisible to the next contributor. When a rule is agreed in chat, review, or commit, write it into the right `docs/content/` file as part of the same change. Treat doc edits as part of the motivating PR. Rewrite relaxed rules; never leave stale guidance.

## 4. Docs describe current reality only — no backstory

Write docs as if today is the first day. **No** "we used to…", "an earlier iteration…", "was removed", "historical note", "migrated out" — none of it. When explaining _why_ something is shaped the way it is, frame it as the tradeoff the current choice makes, not as a war story about what we tried before. Backstory belongs in commit messages and PR descriptions; docs rot the moment they accumulate it.

The one exception is the ADR log in [`docs/content/decisions/`](../../../docs/content/decisions/index.md). Backstory and tradeoffs belong _there_ — topic docs still describe current reality and link across to the relevant ADR when the _why_ matters.

## 5. ADRs for structural choices

When a topic doc sprouts a "we chose X because…" paragraph, extract it into an ADR under `docs/content/decisions/NNNN-slug.md` and link from the topic doc. Write a new ADR when a design call isn't self-evident from reading the code and is likely to be re-litigated later. ADRs are numbered sequentially, zero-padded to 4 digits, and never renumbered — when an ADR is superseded, flip `Status` and link forward.

Skip ADRs for micro-decisions (naming, formatting) and for anything already obvious from file structure.

## 6. Wire it into the sidebar

Every new `docs/content/<slug>.md` must be added to `docs/.vitepress/config.ts` under the most relevant section (`Foundation`, `UI`, `Data`, `Quality`, `Releases`, `Recipes`, `Decisions`). A doc that isn't on the sidebar is invisible to humans.
