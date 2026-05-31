---
name: pre-commit
description: Use when about to commit, finishing a task, or before declaring work complete on noirium. Runs the full verification pipeline (lint + format + test + css:check via vp run task:pre-commit, plus typecheck) and reports pass/fail per step. Accepts --fix to auto-fix lint and format issues first.
disable-model-invocation: true
allowed-tools: Bash(pnpm *), Bash(vp *), Read
---

Read [`.agents/skills/pre-commit/SKILL.md`](../../../.agents/skills/pre-commit/SKILL.md) for the procedure. That file is the single source of truth, shared with Codex CLI and Gemini CLI.
