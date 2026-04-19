import { useState, useEffect } from 'react'
import tinycolor from 'tinycolor2'
import { getColorName } from '../../utils/colorName'
import { normalizeRgbString } from '../../utils/colorConversion'

export const useColorMatching = (color: string) => {
    const [colorName, setColorName] = useState('')

    useEffect(() => {
        let cancelled = false
        try {
            const hex = tinycolor(normalizeRgbString(color)).toHexString()
            getColorName(hex.substring(1)).then(name => {
                if (!cancelled) setColorName(name)
            })
        } catch {
            // leave colorName as-is on bad input
        }
        return () => { cancelled = true }
    }, [color])

    return { colorName }
}
