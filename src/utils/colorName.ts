type ColorFinder = (hex: string) => { name: string } | null

let findNearestColor: ColorFinder | null = null

const initColorName = async (): Promise<ColorFinder> => {
    if (findNearestColor) return findNearestColor
    const [{ colornames }, { default: nearestColor }] = await Promise.all([
        import('color-name-list'),
        import('nearest-color'),
    ])
    const colorMap: Record<string, string> = Object.fromEntries(
        colornames.map(({ name, hex }: { name: string; hex: string }) => [name, hex])
    )
    findNearestColor = nearestColor.from(colorMap)
    return findNearestColor
}

export const getColorName = async (hex: string): Promise<string> => {
    try {
        const find = await initColorName()
        const result = find(`#${hex}`)
        return result ? result.name : hex
    } catch {
        return hex
    }
}
