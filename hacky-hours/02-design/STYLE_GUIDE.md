# Style Guide

## Typography

Three typefaces are in use, each with a distinct role:

| Face | Where used | Load |
|------|-----------|------|
| **Inclusive Sans** | Body copy, labels, UI chrome | Google Fonts |
| **Roboto Condensed** | Swatch names, palette labels | Google Fonts |
| **PT Serif** | Parts count display on swatches | Google Fonts |

Loaded via `@import` in `Mixer.module.scss`. All three are declared in the same Google Fonts URL.

### Type scale (in use)

| Size | Usage |
|------|-------|
| `2rem` | Parts count (swatch) |
| `1.5rem` | Subtract/add buttons |
| `1.2rem` | Theme toggle icon |
| `1rem` | General UI buttons |
| `0.9rem` | Recipe heading, icon buttons |
| `0.85rem` | Solver label, status text |
| `0.8rem` | Swatch name, solver chips, paint library rows |
| `0.75rem` | Recipe detail text |
| `0.7rem` | Brand name in paint library |

---

## Color System

All UI chrome colors are CSS custom properties defined in `src/theme.scss`. The `[data-theme="dark"]` block on `<html>` switches the palette. Never use hardcoded hex values for UI chrome — use a variable.

### Light theme

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#f5f5f5` | Solver banner, tab hover |
| `--color-surface-alt` | `#e8e8e8` | Button hover states |
| `--color-hover` | `#f0f0f0` | List row hover |
| `--color-border` | `#dddddd` | Panel dividers |
| `--color-border-subtle` | `#cccccc` | Input borders, tab divider |
| `--color-border-strong` | `#000000` | Color box, swatch, mix graph borders |
| `--color-text-primary` | `#000000` | Body text, active tab indicator |
| `--color-text-secondary` | `#555555` | Secondary labels, muted controls |
| `--color-text-muted` | `#888888` | Status text, brand names |
| `--color-input-bg` | `#ffffff` | Select and button backgrounds |
| `--color-picker-inputs-bg` | `rgba(255,255,255,0.7)` | Color wheel input row overlay |

### Dark theme overrides

| Variable | Value |
|----------|-------|
| `--color-bg` | `#1a1a1a` |
| `--color-surface` | `#252525` |
| `--color-surface-alt` | `#333333` |
| `--color-hover` | `#333333` |
| `--color-border` | `#404040` |
| `--color-border-subtle` | `#363636` |
| `--color-border-strong` | `#777777` |
| `--color-text-primary` | `#e8e8e8` |
| `--color-text-secondary` | `#aaaaaa` |
| `--color-text-muted` | `#777777` |
| `--color-input-bg` | `#2a2a2a` |
| `--color-picker-inputs-bg` | `rgba(0,0,0,0.5)` |

### Dynamic contrast (palette colors)

Swatch backgrounds are user-selected and can be any color. `src/utils/isDark.ts` determines whether a given background is perceptually dark and returns a boolean. Components use this to choose between light and dark foreground text/icons. **This is separate from the theme system** — it applies on top of any theme, and must not be removed or bypassed.

---

## Spacing

No formal spacing scale is defined — values are set per-component using `rem` units. Common values in use:

- `0.25rem` — tight padding (icon buttons, input insets)
- `0.5rem` — standard gap (filter row, chip gap)
- `0.75rem` — medium gap (solver banner)
- `1rem` — section padding

---

## Shape

| Pattern | Value | Where |
|---------|-------|-------|
| Round buttons / icons | `border-radius: 50%` | Theme toggle, subtract button, chip swatch |
| Pill inputs / selects | `border-radius: 4px` | Paint Library selects, solver Apply button |
| Swatch bottom corners | `border-radius: 0 0 20% 20%` | Palette swatches |

---

## Theme Toggle

The dark/light toggle is a fixed `2.5rem` circular button at `bottom: 1rem; right: 1rem; z-index: 100`. It uses `--color-surface` and `--color-border` so it always matches the current theme, and `opacity: 0.7` at rest, `1` on hover. Implemented in `Mixer.module.scss` (`.themeToggle`) and wired via `useTheme` hook.

---

## Fonts: Adding or Changing

If a typeface is added or changed, update the Google Fonts `@import` URL in `Mixer.module.scss` and add a row to the typography table above.
