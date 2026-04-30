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

## Journey: Color Solver

A painter wants the app to suggest the best mix automatically.

```mermaid
flowchart TD
    A[Set target color] --> B[Solver runs automatically in background]
    B --> C[Suggested mix appears in solver banner\nbelow mix graph]
    C --> D{Happy with suggestion?}
    D -- Yes --> E[Click Apply\nPalette parts updated]
    D -- No --> F[Toggle Precision mode\nfor higher accuracy\nor adjust manually]
```

## Journey: Browse Paint Library

A painter wants to add a specific real-world paint color to their palette.

```mermaid
flowchart TD
    A[Click + to open add-color panel] --> B[Select Paint Library tab]
    B --> C[Choose a medium\ne.g. Oil, Acrylic, Watercolor]
    C --> D[Optionally filter by brand]
    D --> E[Browse alphabetized color list\nwith inline swatches]
    E --> F[Click a color to select it]
    F --> G[Color added to palette\nwith real paint name]
```
