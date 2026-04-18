# Backlog

Tasks are removed when their PR is merged. Completed work goes in CHANGELOG.md.

---

## V1 — Color Solver

- [ ] Design solver algorithm — research optimization approaches for Kubelka-Munk latent space (brute force vs. gradient descent vs. combinatorial search); document decision in `02-design/decisions/`
- [ ] Implement color solver (find best palette mix to minimize deltaE94 against target)
- [ ] Run solver in a Web Worker to avoid blocking the UI
- [ ] Display solver result as a suggested mix the user can apply or dismiss

## Housekeeping

- [ ] Performance audit: profile re-render frequency in Mixer; review `useEffect` chains and redundant `tinycolor()` calls in ColorBoxUI/ColorSwatches
- [ ] Accessibility audit: keyboard navigation, ARIA labels on icon-only buttons, focus management in color picker
- [ ] Add unit tests for `isDark.ts`
- [ ] Add tests for `useColorMatching`, `useColorName`, `useLocalStorage`, `useSwatchAdder`
- [ ] Add tests for `Mixer.tsx` (orchestrator — currently untested)
