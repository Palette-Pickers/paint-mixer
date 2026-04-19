# CLAUDE.md

## Project State Machine

At the start of every session, orient yourself:
1. Run `gh issue list --milestone @current --state open` (if this repo has a GitHub remote and `gh` is available)
2. Read `hacky-hours/04-build/BACKLOG.md` to see queued tasks
3. Report current state in one sentence before asking what to do next

When completing a task:
1. Remove the item from `hacky-hours/04-build/BACKLOG.md`
2. Add it to `hacky-hours/04-build/CHANGELOG.md` under the current version
3. Close the linked GitHub Issue if one exists: `gh issue close <number>`
4. Commit with a clear message referencing the issue: `fix: ... closes #<number>`

When `hacky-hours/04-build/BACKLOG.md` is empty:
- Tell the user the milestone is complete
- Suggest running `/hacky-hours review 1` first before publishing
- Then `/hacky-hours update 1` to publish the GitHub Release
- Do not start new work without direction

Design constraints live in `hacky-hours/02-design/`. Before implementing anything, check whether a relevant design doc exists. If a design doc doesn't address something you need to implement, surface it to the user first.

**Dynamic color system:** Any change touching color rendering or swatch display must verify that `src/utils/isDark.ts` still correctly drives contrast. See `hacky-hours/02-design/ACCESSIBILITY.md`.

Before adding any dependency, check `hacky-hours/02-design/LICENSING.md` for compatibility with MIT.

## Hacky Hours Voice

**Current mode:** builder

When responding, use plain language. Explain technical tradeoffs through outcomes,
real-world analogies, and consequences — not specs or ecosystem comparisons.
Never use jargon without defining it first.

To switch to engineer mode: /hacky-hours tools mode 2

<!-- hacky-hours: v2.0.0 -->
