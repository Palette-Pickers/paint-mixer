import React, {useState, useEffect} from 'react';
import styles from './Mixer.module.scss';
import mixbox from 'mixbox';
import {defaultPalette} from '../../utils/palettes/defaultPalette';
import {ColorPart, Rgb} from '../../types/types';
import {normalizeRgbString, rgbToXyz, xyzToLab, deltaE94} from '../../utils/colorConversion';

import ColorPicker from '../ColorPicker/ColorPicker';
import ColorBoxUI from '../ColorBoxUI/ColorBoxUI';
import ColorSwatches from '../ColorSwatches/ColorSwatches';
import AddColorUI from '../AddColorUI/AddColorUI';
import MixedColorContainer from '../MixedColorContainer/MixedColorContainer';


import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import tinycolor from "tinycolor2";

import usePaletteManager from '../../data/hooks/usePaletteManager';
import {useColorMatching} from '../../data/hooks/useColorMatching';
import {useLocalStorage} from '../../data/hooks/useLocalStorage';

import {MdAddCircleOutline} from 'react-icons/md';
import {AiOutlineClose} from 'react-icons/ai';
import {FaInfo} from 'react-icons/fa';
import {TbTargetArrow, TbTargetOff, TbTarget} from 'react-icons/tb';
import {VscDebugRestart} from 'react-icons/vsc';
import TargetColorContainer from '../TargetColorContainer/TargetColorContainer';

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
            return mixed_color;
        }
        return tinycolor('rgba(255,255,255,0)')?.toRgbString() ?? '';
    };

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
        const normalizedColor = tinycolor(rgbString)?.toHexString();
        return palette.some(swatch => tinycolor(swatch.rgbString)?.toHexString() === normalizedColor);
    };

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
        setMixedColor(getMixedRgbStringFromPalette(palette));
    }, [palette]);

    useEffect(() => {
        setMatchPercentage(getRgbColorMatch((mixedColor), (hsvaToRgbaString(targetColor))).toFixed(2));
    }, [mixedColor, targetColor]);

    useEffect(() => {
        setIsSavable(!isColorInPalette(mixedColor, palette));
    }, [mixedColor, palette]);

return (
    <>
        <main className={styles.Mixer}>
            <div className={styles.colorBox}>
                <section className={styles.mixedColorContainer}
                    style={{
                        backgroundColor: mixedColor,
                        color: tinycolor(mixedColor)?.isDark() ? 'white' : 'black'
                    }}
                >
                    <div className={styles.mixedColorValues}>
                        <div>
                            <label htmlFor="mixed-color">
                                Mixed Color
                            </label>
                            <div id="mixed-color">
                                <p>
                                    {(tinycolor(normalizeRgbString(mixedColor)).toHexString())}
                                </p>
                                <p>
                                    {mixedColorName}
                                </p>
                            </div>
                        </div>

                        {isUsingTargetColor && (
                            <div className={styles.matchPct}
                                style={{color: tinycolor(mixedColor)?.isDark() ? 'white' : 'black'}}
                            >
                                <label>Target Match</label>
                                <div>{matchPercentage}%</div>
                            </div>
                        )}
                    </div>
                </section>

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

                <div className={styles.transparencyBox}></div>
            </div>

            <section className={styles.swatches}>
                <ColorSwatches
                    palette={palette}
                    handleSwatchIncrement={handleSwatchIncrement}
                    handleSwatchDecrement={handleSwatchDecrement}
                    handleRemoveFromPalette={handleRemoveFromPalette}
                    updateColorName={updateColorName}
                    totalParts={totalParts}
                />

                <div className={styles.addColorUi}>
                    <button
                        style={{
                            visibility: (showAddColorPicker) ? 'hidden' : 'visible',
                            display: (showAddColorPicker) ? 'none' : 'block',
                            cursor: (showAddColorPicker) ? 'default' : 'pointer'
                        }}
                        onClick={() => setShowAddColorPicker(!showAddColorPicker)}
                    >
                        <MdAddCircleOutline />
                    </button>

                    {showAddColorPicker && (
                        <div
                            className={styles.colorPickerContainer}
                            style={{backgroundColor: tinycolor(addColor)?.toHexString()}}
                        >

                            <ColorPicker
                                color={addColor}
                                onChange={(newColor) => {setAddColor(newColor);}}
                                onClose={() => setShowAddColorPicker(false)}
                                onConfirm={confirmColor}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    </>
);

};

export default Mixer;
