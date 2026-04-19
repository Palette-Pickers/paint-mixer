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

## Future: Color Solver Algorithm (Planned — V1)

Given a target color and an existing palette, find the mix of palette colors (and their proportions) that minimizes deltaE94 against the target.

Design considerations:
- Search space: all combinations of N palette colors with varying part ratios
- The mixing function is non-linear (Kubelka-Munk latent space), so brute force or gradient-based optimization may both be viable
- Result should suggest the simplest mix (fewest colors) that achieves an acceptable match threshold
- This is computationally heavier than the current live mixing — may need to run in a Web Worker to avoid blocking the UI
