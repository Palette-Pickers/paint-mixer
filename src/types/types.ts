export type ColorPart = {
	label: string
	partsInMix: number
	rgbString: string
	recipe?: ColorPart[]
}

export type PaletteManager = {
	palette: ColorPart[]
	handleSwatchIncrement: (index: number) => void
	handleSwatchDecrement: (index: number) => void
	handleRemoveFromPalette: (index: number) => void
	resetPalette: () => void
	addToPalette: (rgbString: string, includeRecipe: boolean) => void
	updateColorName: (index: number, newName: string) => void
}

export type Rgb = {
	r: number
	g: number
	b: number
	a?: number
}

export type Hsva = {
	h: number
	s: number
	v: number
	a: number
}
