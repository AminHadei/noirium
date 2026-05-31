# /pr-review procedure

Source of truth for the `/pr-review` command. Tool-specific command files (`.claude/commands/pr-review.md`, `.cursor/commands/pr-review.md`) are thin shims that point here.

You are reviewing this repository's current branch against `master`.

1. **Load conventions.** Read [`AGENTS.md`](../../AGENTS.md) for orientation and the doc table. Treat the topic docs and `AGENTS.md` rules as the baseline — newly introduced violations default to Nit.
2. **Load calibration.** Read [`REVIEW.md`](../../REVIEW.md) for severity calibration (which rules escalate to Important, the nit cap, the skip list, the verification bar, the summary shape). REVIEW.md overrides default review behaviour — follow it exactly.
3. **Get the diff.** Run `git diff master...HEAD` to see what changed. Review every file in the diff, not just a sample.
4. **Cite concretely.** For each finding, cite `file:line` and quote the offending code. Do not infer behaviour from naming alone — see REVIEW.md → _Verification bar_.
5. **Changeset check.** Verify at least one new `.changeset/*.md` was added on the branch (excluding `README.md`). If the change is user-visible and no changeset exists, flag it as Important per [`docs/content/changesets.md`](../../docs/content/changesets.md).
6. **Report in the summary shape REVIEW.md specifies:** one-line tally (`N important, M nits` or `No blocking issues`), 1–3 sentence summary of the PR's intent, then findings grouped by severity.
7. **Flag stale guidance.** If the PR makes any `AGENTS.md` or topic-doc rule outdated, flag that the doc needs updating too — see the `doc-authoring` skill.

## Don'ts

- **Don't auto-fix.** This is read-only review.
- **Don't run lint/typecheck/tests.** Husky and CI already enforce these — REVIEW.md → _Do not report_ explicitly excludes them. If you need to confirm a behaviour claim, prefer reading the code over running the suite.
- **Don't commit, push, or amend.**
- **Don't pad.** If the diff is trivially small (one-line fix, typo), the report can be 5 lines.
