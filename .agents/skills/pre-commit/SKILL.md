---
name: pre-commit
description: Use when about to commit, finishing a task, or before declaring work complete on noirium. Runs the full verification pipeline (lint + format + test + css:check via vp run task:pre-commit, plus typecheck) and reports pass/fail per step. Accepts --fix to auto-fix lint and format issues first.
disable-model-invocation: true
allowed-tools: Bash(pnpm *), Bash(vp *), Read
---

Run the full post-change verification pipeline for `noirium` and report results.

The pipeline is documented in [`docs/content/conventions.md`](../../../docs/content/conventions.md) under _Post-change verification_ — read it if you need the per-step rationale.

## Steps

### 1. Run the pipeline

```!
vp run task:pre-commit
```

This chains: `pnpm lint && pnpm format && vp run task:test && vp run task:css:check`. The task runner handles dependency resolution (builds the library before css:check if needed) and caching (skips unchanged work).

### 2. Type check

The pre-commit task does not include type checking. Run it separately:

```!
pnpm typecheck
```

### 3. Report

For each step, report one of:

- **Passed** — no output needed
- **Failed** — show the exact error output and suggest a fix

If everything passed, say so in one line. Do not add filler.

If `$ARGUMENTS` contains `--fix`, attempt to auto-fix lint and format issues before reporting:

```!
pnpm format:fix && pnpm lint
```
