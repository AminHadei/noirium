---
name: code-review
description: Use when reviewing a pull request, branch, or diff against noirium conventions — flagging issues, assigning severity, deciding what to report. Loads the repo's severity calibration (which violations escalate to Important, which nits are skipped, the nit cap, the "do not report" list, and the verification bar) so review output matches team standards instead of generic linter output.
---

# Code-review calibration for noirium

The full review rubric lives in [`REVIEW.md`](../../../REVIEW.md) at the repo root. Read it before producing any review output.

Project conventions referenced by the rubric live in [`AGENTS.md`](../../../AGENTS.md) (orientation + agent rules) and the topic docs under [`docs/`](../../../docs/content/index.md). Conventions there default to Nit unless `REVIEW.md` promotes them.
