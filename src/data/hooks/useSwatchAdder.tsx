import { useState } from 'react'
import tinycolor from 'tinycolor2'
import { ColorPart } from '../../types/types'
import { getColorName } from '../../utils/colorName'

export const useSwatchAdder = (initialPalette: ColorPart[]) => {
    const [ palette, setPalette ] = useState<ColorPart[]>(initialPalette)

    const addToPalette = (rgbString: string, includeRecipe: boolean) => {
        if (isColorInPalette(rgbString)) {
            console.error("Selected color already in palette", rgbString)
            return
        }
        const hexColor = tinycolor(rgbString).toHexString()
        const colorName = getColorName(hexColor.substring(1))
        const newColor: ColorPart = {
            rgbString,
            label: colorName,
            partsInMix: 0,
        }
        if (includeRecipe) {
            newColor.recipe = palette.filter(color => color.partsInMix > 0)
        }
        setPalette(prev => [ ...prev, newColor ])
    }

    const isColorInPalette = (rgbString: string) => {
        const normalizedColor = tinycolor(rgbString).toHexString()
        return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor)
    }

    return { palette, setPalette, addToPalette }
}
