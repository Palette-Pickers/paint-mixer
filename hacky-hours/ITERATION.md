# Iteration Log — post v1.4.0

## Captured

### Dark mode: missing text color on Apply button and + button (bug)
Two elements inherited black text color instead of using the theme variable in dark mode:
- "Apply" button in the Suggested Mix solver banner (`Mixer.module.scss` `.solverApply`)
- "+" add-to-palette button (`AddColorUiComponent.module.scss` `>button`)

Both fixed by adding `color: var(--color-text-primary)`.

## Synthesized

| Item | Type | Design doc affected |
|---|---|---|
| Dark mode incomplete — missing color vars on two buttons | Bug fix | none (implementation-only) |

## Prioritized

- **Hotfix:** Both fixes applied directly; ready to commit.

## Status
Triaged. Fixes applied.

---

# Iteration Log — post v1.2.0

## Captured

### Paint Library browser (new feature)
Add an interface to browse and add real paint colors from the `paint-crawl` dataset.

- User selects a medium (acrylic, oil, watercolor, etc.)
- Optionally filters by brand
- Picks a color from an alphabetized list with color swatches
- Color is added to the palette

**Data source:** `beekman/paint-crawl` git submodule (~53,000 entries, 21 medium types, fields: medium/brand/name/hex/rgb/hex_available)
**Loading strategy:** Lazy fetch per medium file; served as static assets via CopyWebpackPlugin → `/paint-data/`
**UI integration:** "Paint Library" tab added to the existing add-color panel (alongside current color wheel tab)

## Synthesized

| Item | Type | Design doc affected |
|---|---|---|
| Paint Library browser | New feature | BUSINESS_LOGIC, USER_JOURNEYS, ARCHITECTURE |
| Color Solver shipped in v1.2.0 | Stale placeholder | BUSINESS_LOGIC, USER_JOURNEYS |

## Prioritized

- **Next milestone (v1.3.0):** Paint Library browser

## Status
Triaged. Design docs amended. Tasks queued in BACKLOG.md.
