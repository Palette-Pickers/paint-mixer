# User Journeys

## Primary Journey: Mix to Match a Target

A painter wants to reproduce a specific color using paints they already own.

```mermaid
flowchart TD
    A[Open app] --> B[Palette loads from localStorage\nor default palette on first visit]
    B --> C[User sets a target color\nvia Target button + color picker]
    C --> D[User clicks swatches to add parts\nof each color to the mix]
    D --> E[Mixed color and match % update live]
    E --> F{Happy with the match?}
    F -- No --> D
    F -- Yes --> G[User clicks Save\nto add mix to palette]
    G --> H[Mix saved with recipe\nPalette updated in localStorage]
```

## Secondary Journey: Catalog Paints

A painter sets up their palette before mixing.

```mermaid
flowchart TD
    A[Open app] --> B[Click + to open color picker]
    B --> C[Select color / enter RGB or hex values]
    C --> D[Click Confirm]
    D --> E[Swatch appears in palette\nwith auto-generated name]
    E --> F[User clicks swatch name to rename it]
    F --> G[Repeat for each paint color owned]
```

## Tertiary Journey: Review a Recipe

A painter wants to recall how they mixed a saved color.

```mermaid
flowchart TD
    A[Find a saved mixed color in palette] --> B[Click info button on swatch]
    B --> C[Recipe displayed\nshowing ingredient colors and proportions]
```

## Future Journey: Color Solver (Planned — V1)

A painter wants the app to suggest the best mix automatically.

```mermaid
flowchart TD
    A[Set target color] --> B[Trigger solver]
    B --> C[Algorithm searches palette combinations]
    C --> D[Returns suggested mix with proportions]
    D --> E[User reviews and applies suggested mix]
```
