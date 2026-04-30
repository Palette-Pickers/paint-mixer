# Backlog

Tasks are removed when their PR is merged. Completed work goes in CHANGELOG.md.

---

## v1.4.0 — Dark Mode

- [ ] Define CSS custom properties for all UI colors (light theme) in a global stylesheet; add `[data-theme="dark"]` overrides for the dark theme (~15–20 variables)
- [ ] Audit all `.module.scss` files and replace hardcoded color values with the new CSS variables
- [ ] Add a theme toggle button to the UI; persist the chosen theme to localStorage; respect `prefers-color-scheme` as the default
- [ ] Verify dynamic contrast (`isDark.ts`) still works correctly in dark mode for palette swatches and color-backed elements

## Housekeeping

