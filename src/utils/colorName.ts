import colornames from 'color-name-list/dist/colornames.json'
import nearestColor from 'nearest-color'

const colorMap: Record<string, string> = Object.fromEntries(
    (colornames as Array<{ name: string; hex: string }>).map(({ name, hex }) => [name, hex])
)

const findNearestColor = nearestColor.from(colorMap)

export const getColorName = (hex: string): string => {
    try {
        const result = findNearestColor(`#${hex}`)
        return result ? result.name : hex
    } catch {
        return hex
    }
}
