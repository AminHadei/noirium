---
description: Code review of the current branch. Reads AGENTS.md for project conventions and REVIEW.md for severity calibration, then reviews the diff against main.
---

You are reviewing this repository's current branch against `main`.

1. Read [@AGENTS.md](../../AGENTS.md) for project conventions (dual-build system, feature structure, web-component recipe, styling, TypeScript, testing, changesets, hard boundaries, etc.). AGENTS.md is the single source of truth — `CLAUDE.md` defers to it. Newly introduced violations default to Nit.
2. Read [@REVIEW.md](../../REVIEW.md) for review calibration (which rules escalate to Important, nit cap, skip list, verification bar, summary shape). REVIEW.md overrides default review behavior — follow it exactly.
3. Run `git diff main...HEAD` to see what changed. Review every file in the diff, not just a sample.
4. For each finding, cite `file:line` and quote the offending code. Do not infer behavior from naming alone.
5. Report in the summary shape REVIEW.md specifies: one-line tally (`N important, M nits` or `No blocking issues`), a 1–3 sentence summary of the PR's intent, then findings grouped by severity. Include the dual-build / changeset callouts REVIEW.md asks for when they apply.
6. If the PR makes any AGENTS.md guidance outdated, flag that AGENTS.md needs updating too.

Do not auto-fix. Do not run lint/format/typecheck/tests/`vp run task:pre-commit` unless the user asks — those are pre-commit / CI concerns and REVIEW.md tells you not to re-report them.
