# ADR: Color Solver Algorithm

**Date:** 2026-04-18  
**Status:** Accepted

## Decision

Use a brute-force simplex grid search over palette subsets of size 1–3.

## Context

Given a target color and an existing palette, the solver must find the palette mix (colors + proportions) that minimizes deltaE94 against the target. The Kubelka-Munk latent space is non-linear, which rules out closed-form solutions.

Three approaches were considered:

| Approach | Pros | Cons |
|---|---|---|
| Brute force simplex grid | Simple, no dependencies, naturally caps complexity at 3 colors | Fixed granularity (step size) |
| Gradient descent | Precise, fast convergence | Needs optimizer, local minima risk, harder to explain |
| Greedy subset selection | Very fast | Misses cases where a 2-color combo beats either color alone |

## Rationale

The search space for a palette of 8 colors with 12 total parts is ~3,400 evaluations — trivially fast in a Web Worker (<100ms). Brute force wins here because the problem is small enough that exhaustive search costs nothing and eliminates the correctness risks of local minima or greedy mis-steps.

The 3-color cap is also a deliberate UX constraint: mixing more than 3 paint colors for a single mix is impractical for a real painter.

## Implementation

- Enumerate all C(N, k) subsets for k ∈ {1, 2, 3}
- For each subset, enumerate all integer compositions of 12 (each color gets ≥1 part)
- For each (subset, weights) pair: blend via mixbox latent space, compute deltaE94
- Return the combination with the lowest deltaE94; prefer fewer colors in ties
- Run in a Web Worker to avoid blocking the UI

## Consequences

- Solver granularity is 1/12 of total parts per color (~8.3%). Fine enough for practical paint mixing.
- If palette grows beyond ~10 colors, subset enumeration for k=3 still completes in well under 1 second.
- To improve precision later, increase TOTAL_PARTS (e.g., 24) — the only tradeoff is more evaluations.
