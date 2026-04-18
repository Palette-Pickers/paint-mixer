import { useMemo } from 'react'
import tinycolor from 'tinycolor2'
import { getColorName } from '../../utils/colorName'
import { normalizeRgbString } from '../../utils/colorConversion'

export const useColorMatching = (color: string) => {
    const colorName = useMemo(() => {
        try {
            const hex = tinycolor(normalizeRgbString(color)).toHexString()
            return getColorName(hex.substring(1))
        } catch {
            return ''
        }
    }, [color])

    return { colorName }
}
