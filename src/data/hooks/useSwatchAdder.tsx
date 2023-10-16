import {useState} from 'react';
import tinycolor from "tinycolor2";
import {ColorPart} from '../../types/types';
import {useColorName} from './useColorName';

export const useSwatchAdder = (initialPalette: ColorPart[]) => {
    const [palette, setPalette] = useState<ColorPart[]>(initialPalette);

    const addToPalette = async (rgbString: string, includeRecipe: boolean) => {
        if (!isColorInPalette(rgbString)) {
            let updatedPalette = [...palette];
            const hexColor = tinycolor(rgbString).toHexString();
            const colorName = await useColorName(hexColor.substring(1));
            const newColor: ColorPart = {
                "rgbString": rgbString,
                "label": colorName,
                "partsInMix": 0,
            };
            if (includeRecipe) {
                newColor.recipe = palette.filter(color => color.partsInMix > 0);
            }
            updatedPalette.push(newColor);
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", rgbString);
        }
    };

    const isColorInPalette = (rgbString: string) => {
        const normalizedColor = tinycolor(rgbString).toHexString();
        return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor);
    };

    return {palette, setPalette, addToPalette};
};
