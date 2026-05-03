# Backlog

Tasks are removed when their PR is merged. Completed work goes in CHANGELOG.md.

---

## v1.5.0 — Preferences Panel

- [x] **Gear button + proximity fade** — Add a gear icon button fixed to bottom-right (replacing the current theme toggle position). On desktop, button is fully transparent at rest and fades in when the cursor is within ~100px of the button. On mobile/touch, button is always visible at reduced opacity (no hover available). Toggles `showPreferences` state.
- [x] **Preferences banner** — When `showPreferences` is true, render a banner anchored above the gear button (similar layout to the solver banner). Banner closes when the gear is clicked again or the user clicks outside.
- [x] **Wire toggles into banner** — Move the Dark/Light mode toggle into the Preferences banner. Add a copy of the Precision mode checkbox labeled "Suggested Mix Precision mode" that shares the same `precisionMode` state as the existing solver banner checkbox.

## Housekeeping

