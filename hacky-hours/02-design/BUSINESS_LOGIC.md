# Business Logic

## Paint Mixing Engine (Kubelka-Munk via Mixbox)

Paint Mixer uses `mixbox` rather than simple RGB averaging. The difference matters: mixing blue and yellow RGB values gives gray; mixing blue and yellow pigments gives green. Mixbox implements the Kubelka-Munk model, which predicts pigment behavior based on light absorption and scattering.

**How it works:**
1. Each paint color's `rgbString` is converted to a 7-float latent vector via `mixbox.rgbToLatent()`
2. Latent vectors are averaged, weighted by each color's `partsInMix / totalParts`
3. The blended latent vector is converted back to RGB via `mixbox.latentToRgb()`
4. Result is normalized via `normalizeRgbString()` in `colorConversion.tsx`

This runs in `Mixer.tsx` → `getMixedRgbStringFromPalette()` on every palette state change.

## Color Match Percentage

To measure how close the mixed color is to the target, the app uses CIE deltaE94 — a perceptual color difference metric that more closely matches human vision than simple RGB distance.

**Pipeline:**
1. Both colors are converted from RGB to XYZ color space (`rgbToXyz`)
2. XYZ is converted to CIELAB (`xyzToLab`)
3. `deltaE94` computes the perceptual difference (0 = identical, 100 = maximally different)
4. Match percentage = `100 - deltaE94`

Implemented in `src/utils/colorConversion.tsx`, called from `Mixer.tsx` → `getRgbColorMatch()`.

## Dynamic Contrast (isDark)

Any UI element rendered on top of a user-selected color must remain readable. `isDark.ts` determines whether a given color is perceptually dark, so components can choose light or dark text/icon variants accordingly.

**This is a cross-cutting accessibility constraint.** Any change to how colors are displayed or computed must verify that dynamic contrast still works correctly.

## Color Naming

`useColorName` and `useColorMatching` resolve a human-readable name for any color (e.g., "Cadmium Red", "Phthalo Blue") using the `color-name-list` library, which maps hex values to a large database of named colors. The nearest-match name is displayed in the UI.

## Duplicate Detection

Before saving a mixed color to the palette, `isColorInPalette()` in `Mixer.tsx` checks whether a color with the same hex value already exists. Colors are compared in hex space (normalized via `tinycolor`) to avoid false negatives from different string formats.

## Savable State

The `isSavable` flag is `true` when the mixed color is not already in the palette. The Save button is disabled when `isSavable` is false.

## Color Solver

Given a target color and an existing palette, the solver finds the mix of palette colors (and their proportions) that minimizes deltaE94 against the target. See `02-design/decisions/solver-algorithm.md` for the algorithm decision.

- Brute-force simplex grid over all 1–3 color subsets of the palette
- Runs in a Web Worker (`src/workers/colorSolver.worker.ts`) to avoid blocking the UI
- Standard mode: 12-part grid (~26K evaluations for a 15-color palette)
- Precision mode: 24-part grid (~117K evaluations, ~4.5× slower)
- Result displayed in a solver banner with an Apply button

## Paint Library

The app can browse and add real paint colors from the `paint-crawl` dataset (git submodule at `paint-crawl/`).

**Data:** ~53,000 entries across 21 medium types. Each entry has `medium`, `brand`, `name`, `hex`, `rgb`, and `hex_available`. Only entries with `hex_available: true` are shown.

**Loading:** JSON files are served as static assets at `/paint-data/<medium>.json` (copied at build time via CopyWebpackPlugin). A medium file is fetched on demand when the user selects it — never bundled into the main chunk.

**Selection flow:**
1. Panel opens with Oil Paint pre-selected and its data already loading
2. User may change the medium from the dropdown (triggers fetch of that medium's JSON)
3. User optionally filters by brand (populated from loaded data)
4. User picks a color name from an alphabetized list with inline color swatches
5. Color is added to the palette via the existing `addToPalette` flow
