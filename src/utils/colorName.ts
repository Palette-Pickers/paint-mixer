import { colornames } from 'color-name-list'
import nearestColor from 'nearest-color'

const colorMap: Record<string, string> = Object.fromEntries(
    colornames.map(({ name, hex }: { name: string; hex: string }) => [name, hex])
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
