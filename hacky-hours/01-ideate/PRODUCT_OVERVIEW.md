# Product Overview

## Who
Natural media painters — hobbyists and professionals who own a physical set of paints (oils, acrylics, watercolors) and want to plan or reproduce color mixes digitally before committing to real paint.

## What
A browser-based virtual palette and paint mixing simulator. Users catalog their physical paint colors, then mix them in proportions to see the resulting color. A physics-based mixing engine (Kubelka-Munk model via Mixbox) makes the simulated results match how real pigments blend — unlike simple RGB averaging.

Users can also set a target color and see how closely their mix matches it.

## Where
React single-page application. Runs entirely in the browser — no install, no account. Deployed at [paint-mixer.netlify.app](https://paint-mixer.netlify.app).

## When
Active project. Core palette, mixing, target-matching, color solver, paint library (53K real-world colors across 21 mediums), and dark mode are all live at v1.4.0. Actively iterating — next priorities are driven by user feedback and the backlog.

## Why
Mixing physical paint is expensive (wasted paint) and time-consuming. Getting a color right by trial and error means ruining paint and canvas. A digital simulator lets painters experiment freely — testing ratios, checking match percentages — before touching a brush.

## Constraints & Values

**License:** MIT — open source, forkable, others can build on it.

**Privacy:** No user accounts, no server, no analytics. Palette data lives entirely in the user's browser (localStorage). Nothing is collected or transmitted.

**Infrastructure:** Client-side only. Netlify for hosting. No backend to operate or scale.

**Accessibility:** Dynamic color system (isDark utility) ensures UI text and controls remain readable regardless of the background color being displayed. This is a live constraint — changes to color rendering must preserve it.
