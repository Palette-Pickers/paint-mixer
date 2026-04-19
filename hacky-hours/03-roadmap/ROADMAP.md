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

## V1 — Color Solver

The app can already tell you how well a mix matches a target. V1 closes the loop: given a target color, calculate the best mix automatically.

**Milestone goal:** A user sets a target color, triggers the solver, and receives a suggested mix from their existing palette.

**Features:**
- Color solver algorithm (search/optimize over palette combinations to minimize deltaE94)
- Web Worker for non-blocking computation
- Solver result displayed as a suggested mix the user can apply or adjust

## V2+ — Commercial Paint Database

Allow users to browse and select commercial paint colors by brand and name, with accurate RGB values.

**Dependencies:** Requires a separate web crawler application to populate a database from online paint store listings. Build this last.

**Features:**
- Paint brand/product browser
- Search by name (e.g. "Winsor & Newton Cadmium Yellow")
- One-click add to palette with accurate RGB
- Crawler app (separate project)
- Database + lookup API
