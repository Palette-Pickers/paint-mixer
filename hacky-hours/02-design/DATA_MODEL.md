# Data Model

## Core Types (in `src/types/types.ts`)

### ColorPart

The fundamental unit — represents one paint color in the palette.

```typescript
type ColorPart = {
    label: string        // Human-readable name (e.g. "Cadmium Red")
    partsInMix: number   // How many "parts" of this color are in the current mix (0 = not in mix)
    rgbString: string    // Color value as CSS rgb() string, e.g. "rgb(255,39,2)"
    recipe?: ColorPart[] // If this color was created by mixing, its ingredient colors
}
```

The `recipe` field is recursive: a saved mixed color stores the `ColorPart` array that produced it. This allows the UI to display "how was this color made?"

### Palette

A `ColorPart[]` — an ordered array of paint colors the user has cataloged.

### PaletteManager

The shape of the object returned by `usePaletteManager`:

```typescript
type PaletteManager = {
    palette: ColorPart[]
    handleSwatchIncrement: (index: number) => void
    handleSwatchDecrement: (index: number) => void
    handleRemoveFromPalette: (index: number) => void
    resetPalette: () => void
    addToPalette: (rgbString: string, includeRecipe: boolean) => void
    updateColorName: (index: number, newName: string) => void
}
```

### Rgb / Hsva

Internal color representations used during conversions:

```typescript
type Rgb = { r: number; g: number; b: number; a?: number }
type Hsva = { h: number; s: number; v: number; a: number }
```

## Persistence

The palette is stored in `localStorage` under the key `'savedPalette'`, managed by `useLocalStorage`. The value is a JSON-serialized `ColorPart[]`.

No other data is persisted. There is no server-side storage.

## Default Palette

On first load (no localStorage entry), the app seeds the palette from `src/utils/palettes/defaultPalette.tsx` — a set of common artist paint colors (Cadmium Yellow, Ultramarine Blue, Burnt Sienna, etc.).

A CMYK palette is also available in `src/utils/palettes/cmykPalette.tsx`.

## Color Representation

Colors move through several representations depending on context:

| Format | Used for |
|--------|---------|
| `rgb(r,g,b)` string | Storage, palette, Mixbox input |
| `rgba(r,g,b,a)` string | Transparent/unset states |
| `Hsva` object | Color picker UI state |
| `Rgb` object | Color math (XYZ/Lab conversion) |
| Hex string | Color name lookup, deduplication check |
| Mixbox latent (7-float array) | Kubelka-Munk mixing in latent space |
