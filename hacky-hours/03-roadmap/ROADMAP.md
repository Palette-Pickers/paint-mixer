# Roadmap

## Shipped — v1.0.0

Core palette builder, physics-based mixing, and target color matching.

- Palette management (add, remove, rename colors)
- Kubelka-Munk mixing engine (Mixbox)
- Target color picker with live match percentage (deltaE94)
- Save mixed colors to palette with recipe
- Mix graph (visual proportion display)
- Default artist palette + CMYK palette
- localStorage persistence
- Deployed on Netlify

## Shipped — v1.1.0

Performance overhaul and test coverage.

- Eliminated cascading `useEffect` re-renders — palette changes now trigger 1 render instead of 3–4
- Lazy-load `color-name-list` + `nearest-color` into a separate chunk (~500KB deferred)
- Unit and integration tests for core hooks and Mixer orchestrator

## Shipped — v1.2.0

Color solver.

- Brute-force simplex grid solver finds the best 1–3 color mix from the palette to match a target
- Runs in a Web Worker to avoid blocking the UI
- Solver banner with suggested mix, match percentage, Apply button, and Precision mode toggle

## Shipped — v1.3.0

Paint Library.

- Browse ~53K real-world paint colors across 21 mediums via the `beekman/paint-crawl` submodule
- Filter by medium and brand; colors listed alphabetically with inline swatches
- Paint data fetched on demand per medium, never bundled into the main JS chunk
- When All Brands is selected, colors are sorted and labeled as "Brand Name"

## Shipped — v1.4.0

Dark mode.

- Full dark mode driven by CSS custom properties across the entire component tree
- Respects `prefers-color-scheme` on first visit; persists user choice to localStorage
- Dark/Light toggle button fixed to bottom-right corner

## v1.5.0 — Preferences Panel

Replace the standalone dark mode toggle with a unified Preferences system.

- Gear icon button fixed to bottom-right; visually muted on desktop until cursor is within ~100px
- Clicking gear opens a Preferences banner above the button
- Banner contains: Dark/Light mode toggle + Suggested Mix Precision mode toggle
- Precision mode remains in the solver banner as well
