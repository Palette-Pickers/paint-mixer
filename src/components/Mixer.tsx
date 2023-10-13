import React, {useState, useEffect} from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import {defaultPalette} from '../utils/palettes/defaultPalette';
import {ColorPart, Rgb} from '../types/types';
import {normalizeRgbString, rgbToXyz, xyzToLab, deltaE94} from '../utils/colorConversion';
import ColorPicker from './ColorPicker/ColorPicker';

import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import tinycolor from "tinycolor2";

import {TransitionGroup, CSSTransition} from 'react-transition-group';

import usePaletteManager from '../data/hooks/usePaletteManager';
import {useColorMatching} from '../data/hooks/useColorMatching';
import {useLocalStorage} from '../data/hooks/useLocalStorage';

import {TbTargetArrow, TbTargetOff, TbTarget} from 'react-icons/tb';
import {VscDebugRestart} from 'react-icons/vsc';
import {MdAddCircleOutline} from 'react-icons/md';
import {FaArrowDown} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import {FaInfo} from 'react-icons/fa';

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState<string>('rgba(255,255,255,0)');
    const [showAddColorPicker, setShowAddColorPicker] = useState(false);
    const [addColor, setAddColor] = useState({h: 214, s: 43, v: 90, a: 1});
    const [editingColorNameIndex, setEditingColorNameIndex] = useState<number | null>(null);
    const [tempColorName, setTempColorName] = useState<string>('');
    const [targetColor, setTargetColor] = useState({h: 214, s: 43, v: 90, a: 1});
    const [isUsingTargetColor, setIsUsingTargetColor] = useState<boolean>(false);
    const [isShowingTargetColorPicker, setIsShowingTargetColorPicker] = useState<boolean>(false);
    const [activeInfoIndex, setActiveInfoIndex] = useState<number | null>(null);
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
    const {colorName: addColorName} = useColorMatching(tinycolor(addColor).toHexString());

    const toggleIsUsingTargetColor = () => {
        setIsUsingTargetColor(!isUsingTargetColor);
        setIsShowingTargetColorPicker(true);
    };

    const confirmColor = () => {
        if (addColor) {
            const selectedRgbString = tinycolor(addColor).toRgbString();
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

        if (totalParts > 0.000001) {
            let latent_mix = [0, 0, 0, 0, 0, 0, 0];

            for (let j = 0; j < palette.length; j++) {
                if (palette[j].partsInMix > 0.000001) {
                    const latent = mixbox.rgbToLatent(palette[j].rgbString);
                    const percentageUsedInMix = palette[j].partsInMix / totalParts;

                    for (let k = 0; k < latent.length; k++) {
                        latent_mix[k] += latent[k] * percentageUsedInMix;
                    }
                }
            }
            const mixed_color = mixbox.latentToRgb(latent_mix);
            return tinycolor(normalizeRgbString(mixed_color)).toRgbString();
        }
        else return tinycolor('rgba(255,255,255,0)').toRgbString();
    };

    const ColorSwatches = ({palette, handleSwatchIncrement, handleSwatchDecrement, handleRemoveFromPalette, updateColorName}) => {
        return (
            <TransitionGroup className="palette">
                {palette.map((swatch, i) => (
                    <CSSTransition
                        key={i}
                        timeout={500}
                        classNames="fade"
                    >
                        <div className="swatch-container">
                            <div
                                className="swatch"
                                style={{backgroundColor: `${swatch.rgbString}`}}
                            >
                                <div className="swatch-ui">
                                    <a
                                        className="remove-from-palette"
                                        onClick={() => handleRemoveFromPalette(i)}
                                        style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                    >
                                        <AiOutlineClose />
                                    </a>
                                    {editingColorNameIndex === i ? (
                                        <input
                                            value={tempColorName}
                                            onChange={(e) => setTempColorName(e.target.value)}
                                            onBlur={() => {
                                                updateColorName(i, tempColorName);
                                                setEditingColorNameIndex(null);
                                            }}
                                            style={{
                                                color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black',
                                                backgroundColor: tinycolor(swatch.rgbString).isDark() ? 'black' : 'white'
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className='name'
                                            onClick={() => {
                                                setEditingColorNameIndex(i);
                                                setTempColorName(swatch.label);
                                            }}
                                            style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                        >
                                            {swatch.label}
                                        </div>
                                    )}
                                    {swatch.recipe && (
                                        <div className="recipe-info-button">
                                            <a
                                                style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                                onClick={() => setActiveInfoIndex(i === activeInfoIndex ? null : i)}><FaInfo /></a>
                                        </div>
                                    )}
                                    <div
                                        className="partsInMix"
                                        onClick={() => handleSwatchIncrement(i)}
                                        style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                    >
                                        {swatch.partsInMix}
                                        <div className="parts-percentage">
                                            {(swatch.partsInMix > 0.000001) ? (swatch.partsInMix / totalParts * 100).toFixed(0) + '%' : ''}
                                        </div>
                                    </div>

                                    {i === activeInfoIndex && swatch.recipe && (
                                        <div className="recipe-info"
                                            style={{
                                                color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black',
                                                backgroundColor: swatch.rgbString
                                            }}
                                            onClick={() => setActiveInfoIndex(i === activeInfoIndex ? null : i)}
                                        >
                                            {swatch.recipe.map((ingredient, index) => (
                                                <div key={index}>
                                                    <div
                                                        className="recipe-list"
                                                        style={{
                                                            backgroundColor: ingredient.rgbString,
                                                            color: tinycolor(ingredient.rgbString).isDark() ? 'white' : 'black'
                                                        }}>
                                                        {ingredient.partsInMix} {ingredient.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='change-parts-qty'>
                                <button className="subtract-parts" onClick={() => handleSwatchDecrement(i)}>-</button>
                            </div>
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    };

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
        const normalizedColor = tinycolor(rgbString).toHexString();
        return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor);
    };

    const getRgbColorMatch = (color1: string, color2: string): number => {
        const color1Lab = xyzToLab(rgbToXyz(tinycolor(color1).toRgb()));
        const color2Lab = xyzToLab(rgbToXyz(tinycolor(color2).toRgb()));
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
            <main className='Mixer'>
                <div className='color-box'>
                    <section className='mixed-color-container'
                        style={{
                            backgroundColor: mixedColor,
                            color: tinycolor(mixedColor).isDark() ? 'white' : 'black'
                        }}
                    >
                        <div
                            className='mixed-color-values'>
                            <div>
                                <label htmlFor="mixed-color">
                                    Mixed Color
                                </label>
                                <div id="mixed-color">
                                    <p>
                                        {tinycolor(mixedColor).toHexString()}
                                    </p>
                                    <p>
                                        {mixedColorName}
                                    </p>
                                </div>
                            </div>

                            {isUsingTargetColor && (
                                <div className='match-pct'
                                    style={{color: tinycolor(mixedColor).isDark() ? 'white' : 'black'}}
                                >
                                    <label>Target Match</label>
                                    <div>{matchPercentage}%</div>
                                </div>
                            )}
                        </div>
                    </section>
                    {isUsingTargetColor && (
                        <section className='target-color-container'
                            style={{
                                background: hsvaToRgbaString(targetColor),
                                color: tinycolor(hsvaToRgba(targetColor)).isDark() ? 'white' : 'black',
                                display: (isUsingTargetColor ? 'block' : 'none'),
                            }}
                        >

                            {isShowingTargetColorPicker && (
                                <ColorPicker
                                    color={targetColor}
                                    onChange={(newColor) => {
                                        setTargetColor(newColor);
                                    }}
                                    onClose={() => setIsShowingTargetColorPicker(false)}
                                    onConfirm={() => {setIsShowingTargetColorPicker(false);}}
                                />
                            )}
                            {!isShowingTargetColorPicker && (
                                <div className='target-color-values'>
                                    <label htmlFor="target-color">Target Color</label>
                                    <div id="target-color">
                                        {tinycolor(targetColor).toHexString()}
                                        <p>{targetColorName}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                    <div className='color-box-ui'>

                        <div>
                            <button
                                className='reset-mix'
                                onClick={resetPalette}
                                id='reset-mix'
                                style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                    opacity: hasPartsInMix() ? 0.5 : 0 // Change the opacity to indicate it's disabled
                                }}
                            >
                                <VscDebugRestart />
                                <label className='button-reset-mix'>Reset</label>
                            </button>
                        </div>


                        <div className='color-box-label'>
                            <button
                                className="add-to-palette"
                                onClick={() => addToPalette(mixedColor, true)}  // Set includeRecipe to true
                                disabled={!isSavable} // Disable the button based on canSave state
                                style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                    opacity: isSavable ? 1 : 0.5 // Change the opacity to indicate it's disabled
                                }}
                            >
                                <FaArrowDown style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                    opacity: isSavable ? 1 : 0 // Hide the icon when disabled
                                }}
                                />
                                <label className='button-save'>
                                    {isSavable ? 'Save' : 'Saved'}
                                </label>
                            </button>
                        </div>

                        <button
                            className="toggle-target-color"
                            onClick={toggleIsUsingTargetColor}
                            style={{
                                color: isUsingTargetColor ?
                                    tinycolor(hsvaToRgba(targetColor)).isDark() ? 'white' : 'black' :
                                    tinycolor(mixedColor).isDark() ? 'white' : 'black'
                            }}
                        >
                            {(isUsingTargetColor ? <TbTargetArrow /> : <TbTargetOff />)}
                            <label className='button-target-color'>Target</label>
                        </button>
                    </div>
                    <div className='transparency-box'></div>
                </div>

                <section className='swatches'>
                    <ColorSwatches
                        palette={palette}
                        handleSwatchIncrement={handleSwatchIncrement}
                        handleSwatchDecrement={handleSwatchDecrement}
                        handleRemoveFromPalette={handleRemoveFromPalette}
                        updateColorName={updateColorName}
                    />

                    <div className="add-color-ui">
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
                            <section
                                className="color-picker-container"
                                style={{backgroundColor: tinycolor(addColor).toHexString()}}
                            >

                                <ColorPicker
                                    color={addColor}
                                    onChange={(newColor) => {setAddColor(newColor);}}
                                    onClose={() => setShowAddColorPicker(false)}
                                    onConfirm={confirmColor}
                                />


                            </section>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Mixer;
