# Changelog

## v1.3.0

**Paint Library:**
- Browse ~53K real-world paint colors across 21 mediums (oil, acrylic, watercolor, gouache, and more) via the `beekman/paint-crawl` submodule
- "Paint Library" tab added to the add-color panel alongside the existing color picker
- Filter by medium and optionally by brand; colors listed alphabetically with inline swatches
- Clicking a color adds it directly to the palette
- Paint data fetched on demand per medium, cached in memory — never bundled into the main JS chunk
- Oil Paint loads by default when the tab is opened

## v1.2.0

**Color Solver:**
- Brute-force simplex grid solver finds the best 1–3 color mix from the palette to match a target color (minimizes deltaE94)
- Runs in a Web Worker to avoid blocking the UI
- Solver banner shows suggested colors, parts, and match percentage when target mode is active
- "Apply" button sets the suggested mix on the palette directly
- "Precision mode" checkbox doubles part granularity (12 → 24 steps) for higher accuracy at ~4.5× solve time; disabled while solving
- Algorithm decision documented in `02-design/decisions/solver-algorithm.md`

## v1.1.0

**Performance:**
- Eliminated cascading `useEffect` re-renders in Mixer — palette changes now trigger 1 render instead of 3–4
- `mixedColor`, `matchPercentage`, `isSavable`, `totalParts`, and `hasPartsInMix` converted from effect-driven state to `useMemo`
- Pure helper functions moved outside component to prevent recreation on every render
- `targetRgbaString` memoized before passing to `useColorMatching` to prevent spurious color name lookups
- `toggleIsUsingTargetColor` and `confirmColor` wrapped in `useCallback`

- Lazy-load `color-name-list` + `nearest-color` via dynamic `import()` — deferred from main bundle into a separate chunk (~500KB)
- Unit tests for `isDark.ts` (8 cases: transparency, black/white, boundary luma, BT.709 channel weighting)
- Tests for `useLocalStorage`, `useColorMatching`, `useColorName`, `useSwatchAdder` (17 cases)
- Integration tests for `Mixer.tsx` orchestrator (11 cases: render, increment/decrement, reset, remove, add picker, target toggle, save state)
- Fixed pre-existing invalid `export = { from }` in `nearest-color.d.ts`

**Bug fixes:**
- Fixed `color-name-list` UMD crash on load (webpack resolved to UMD bundle where `this` is `undefined`); aliased to ESM build
- Fixed `swatchUi` vertical centering — name and close button now always anchor to the top of the swatch

## v1.0.0

Initial release. Core palette builder and physics-based mixing.

**Features:**
- Palette management — add, remove, and rename paint colors
- Kubelka-Munk mixing engine via Mixbox (accurate pigment simulation)
- Target color picker with live match percentage (deltaE94)
- Save mixed colors to palette with full recipe
- Mix graph showing visual proportion breakdown
- Default artist palette (Cadmium Yellow, Ultramarine Blue, etc.) + CMYK palette
- Color naming via color-name-list
- Dynamic contrast (isDark) for readable UI on any color background
- localStorage persistence across sessions
- Deployed at paint-mixer.netlify.app
