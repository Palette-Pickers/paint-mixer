# Backlog

Tasks are removed when their PR is merged. Completed work goes in CHANGELOG.md.

---

## V1.3.0 — Paint Library

- [ ] Add `beekman/paint-crawl` as a git submodule; configure `CopyWebpackPlugin` to copy `paint-crawl/data/*.json` to `dist/paint-data/` and serve from dev server
- [ ] Create `usePaintLibrary` hook — fetches `/paint-data/<medium>.json` on demand, derives sorted brand list, filters to `hex_available: true`, returns alphabetized color list
- [ ] Create `PaintLibrary` component — medium dropdown, optional brand dropdown, scrollable color list with inline swatches; calls `addToPalette` on selection
- [ ] Add "Paint Library" tab to `AddColorUIComponent` alongside existing color picker tab
- [ ] When adding a color from the Paint Library, use the paint's name (from the library) as the swatch label rather than the auto-generated color name

## Housekeeping

