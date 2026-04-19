# Accessibility

## Target Standard

WCAG 2.1 AA.

## Dynamic Color System

The most significant accessibility constraint in this app: the UI regularly renders text, icons, and controls on top of user-selected colors that can be anything from near-white to near-black. Static color choices for text would fail contrast requirements across much of the color space.

**Solution:** `src/utils/isDark.ts` determines whether a given background color is perceptually dark. Components use this to choose between light and dark foreground variants.

**Constraint:** Any change to color rendering, swatch display, or the color picker must verify that `isDark` still correctly drives contrast. This should be part of the manual test checklist for any UI change.

## Current State

- Dynamic contrast: implemented via `isDark.ts`
- Semantic HTML: uses `<main>` in Mixer root — review other components for semantic element use
- Keyboard navigation: not audited — flagged for review
- Screen reader support: not audited — flagged for review
- Focus management (color picker open/close): not audited

## Known Gaps

- [ ] Keyboard navigation through palette swatches
- [ ] ARIA labels on icon-only buttons (+ / - / x / info)
- [ ] Focus trap in color picker modal
- [ ] Color picker itself may not be fully accessible (third-party component)
- [ ] No skip-to-content link
