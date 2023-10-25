import React, {useState, useEffect} from 'react';
import styles from './Mixer.module.scss';

//components
import AddColorUIComponent from '../AddColorUIComponent/AddColorUIComponent';
import ColorBoxUI from '../ColorBoxUI/ColorBoxUI';
import ColorSwatches from '../ColorSwatches/ColorSwatches';
import MixedColorContainer from '../MixedColorContainer/MixedColorContainer';
import TargetColorContainer from '../TargetColorContainer/TargetColorContainer';

//color mixing and conversion libraries
import {rgbToXyz, xyzToLab, deltaE94, normalizeRgbString} from '../../utils/colorConversion';
import mixbox from 'mixbox';
import tinycolor from "tinycolor2";
import {hsvaToRgbaString} from '@uiw/color-convert';

//custom hooks
import usePaletteManager from '../../data/hooks/usePaletteManager';
import {useColorMatching} from '../../data/hooks/useColorMatching';
import {useLocalStorage} from '../../data/hooks/useLocalStorage';

import {defaultPalette} from '../../utils/palettes/defaultPalette';
import {ColorPart} from '../../types/types';

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState<string>('rgba(255,255,255,0)');
    const [showAddColorPicker, setShowAddColorPicker] = useState(false);
    const [addColor, setAddColor] = useState({h: 214, s: 43, v: 90, a: 1});
    const [isUsingTargetColor, setIsUsingTargetColor] = useState<boolean>(false);
    const [targetColor, setTargetColor] = useState({h: 214, s: 43, v: 90, a: 1});

    const [isShowingTargetColorPicker, setIsShowingTargetColorPicker] = useState<boolean>(false);
    const [matchPercentage, setMatchPercentage] = useState<string>('0.00');
    const [isSavable, setIsSavable] = useState<boolean>(true);
    const [savedPalette, setSavedPalette] = useLocalStorage('savedPalette', defaultPalette);
    const initialPalette: (any) = savedPalette;

    const {
        palette,
        handleSwatchIncrement,
        handleSwatchDecrement,
        handleRemoveFromPalette,
        resetPalette,
        addToPalette,
        updateColorName
    } = usePaletteManager(initialPalette);

    const {colorName: mixedColorName} = useColorMatching(mixedColor);
    const {colorName: targetColorName} = useColorMatching(hsvaToRgbaString(targetColor));
    const {colorName: addColorName} = useColorMatching(tinycolor(addColor)?.toHexString() ?? '');

    const toggleIsUsingTargetColor = () => {
        setIsUsingTargetColor(!isUsingTargetColor);
        setIsShowingTargetColorPicker(true);
    };

    const confirmColor = () => {
        if (addColor) {
            const selectedRgbString = tinycolor(addColor)?.toRgbString() ?? '';
            addToPalette(selectedRgbString, false);  // No recipe for colors added from the color picker
            setShowAddColorPicker(false);
        }
    };

    const hasPartsInMix = (): boolean => {
        return palette.some(color => color.partsInMix > 0);
    };

    const totalParts = palette.reduce((acc, color) => {
        return acc + color.partsInMix;
    }, 0);

    // Helper function to get the mixed color by mixing the colors based on partsInMix in the palette
    const getMixedRgbStringFromPalette = (palette: ColorPart[]): string => {
        let totalParts = palette.reduce((acc, color) => {
            return acc + color.partsInMix;
        }, 0);

        if (totalParts !== undefined && totalParts > 0.000001) {
            let latent_mix: number[] = [0, 0, 0, 0, 0, 0, 0];

            for (let j = 0; j < palette.length; j++) {
                if (palette[j].partsInMix > 0.000001) {
                    const latent = mixbox.rgbToLatent(palette[j].rgbString);
                    if (latent !== undefined) {
                        const percentageUsedInMix = palette[j].partsInMix / totalParts;

                        for (let k = 0; k < latent.length; k++) {
                            latent_mix[k] += latent[k] * percentageUsedInMix;
                        }
                    }
                }
            }
            const mixed_color = mixbox.latentToRgb(latent_mix);
            return normalizeRgbString(mixed_color);
        }
        return tinycolor('rgba(255,255,255,0)').toRgbString() ?? '';
    };

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
        const normalizedColor = tinycolor(normalizeRgbString(rgbString)).toHexString();
        return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor);
    };

    // Helper function to get the % match between two colors
    const getRgbColorMatch = (color1: string, color2: string): number => {
        if (!color1 || (color1===undefined) || !color2 || (color2===undefined)) {
            return 0;
        }
        const color1Rgb = (tinycolor(color1))?.toRgb();
        const color2Rgb = (tinycolor(color2))?.toRgb();
        if (!color1Rgb || !color2Rgb) {
            return 0;
        }

        const color1Lab = xyzToLab(rgbToXyz(color1Rgb));
        const color2Lab = xyzToLab(rgbToXyz(color2Rgb));
        /* tslint:enable */
        return (100 - deltaE94(color1Lab, color2Lab)); //convert % difference to % match
    };



    useEffect(() => {
        const newMixedColor = getMixedRgbStringFromPalette(palette);

        setMixedColor(newMixedColor);
    }, [palette]);

    useEffect(() => {
        setMatchPercentage(getRgbColorMatch((mixedColor), (hsvaToRgbaString(targetColor))).toFixed(2));
    }, [mixedColor, targetColor]);

    useEffect(() => {
        setIsSavable(!isColorInPalette(mixedColor, palette));
    }, [mixedColor, palette]);

    return (
        <main className={styles.Mixer}>
            <div className={styles.colorBox}>
                <MixedColorContainer
                mixedColor={mixedColor}
                mixedColorName={mixedColorName}
                isUsingTargetColor={isUsingTargetColor}
                matchPercentage={matchPercentage}
                />

                <TargetColorContainer
                isUsingTargetColor={isUsingTargetColor}
                targetColor={targetColor}
                isShowingTargetColorPicker={isShowingTargetColorPicker}
                targetColorName={targetColorName}
                setTargetColor={setTargetColor}
                setIsShowingTargetColorPicker={setIsShowingTargetColorPicker}
                />

                <ColorBoxUI
                mixedColor={mixedColor}
                isUsingTargetColor={isUsingTargetColor}
                targetColor={targetColor}
                resetPalette={resetPalette}
                toggleIsUsingTargetColor={toggleIsUsingTargetColor}
                isSavable={isSavable}
                addToPalette={addToPalette}
                hasPartsInMix={hasPartsInMix}
                setMixedColor={setMixedColor}
                palette={palette}
                />

                <div className={styles.transparencyBox}>
                </div>
            </div>
            <ColorSwatches
            palette={palette}
            handleSwatchIncrement={handleSwatchIncrement}
            handleSwatchDecrement={handleSwatchDecrement}
            handleRemoveFromPalette={handleRemoveFromPalette}
            updateColorName={updateColorName}
            totalParts={totalParts}
            />

            <AddColorUIComponent
            showAddColorPicker={showAddColorPicker}
            addColor={addColor}
            setShowAddColorPicker={setShowAddColorPicker}
            setAddColor={setAddColor}
            confirmColor={confirmColor}
            />
        </main>
    );
};

    export default Mixer;
