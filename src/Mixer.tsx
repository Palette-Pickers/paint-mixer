import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider'
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';;
import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import tinycolor from "tinycolor2";
import {defaultPalette} from './utils/palettes/defaultPalette';
import {fetchColorName} from './data/hooks/fetchColorName';
import {
    normalizeRgbString,
    rgbToXyz,
    xyzToLab,
    deltaE94
} from './utils/colorConversion';

import {TbTargetArrow, TbTargetOff, TbTarget} from 'react-icons/tb';
import {VscDebugRestart} from 'react-icons/vsc';
import {MdAddCircleOutline} from 'react-icons/md';
import {FaArrowDown} from 'react-icons/fa';


interface ColorPart {
    label: string;
    partsInMix: number;
    rgbString: string;
    recipe?: ColorPart[];
}

interface Rgb {
    r: number;
    g: number;
    b: number;
    a?: number;
}

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState<string>('rgba(255,255,255,0)');
    const [palette, setPalette] = useState<ColorPart[]>(defaultPalette);
    const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker
    const [selectedHsva, setSelectedHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
    const [tempLabel, setTempLabel] = useState<string>('');
    const [targetHsva, setTargetHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [useTargetHsva, setUseTargetHsva] = useState<boolean>(false);
    const [showTargetHsvaPicker, setShowTargetHsvaPicker] = useState<boolean>(false); // State to toggle color picker
    const [matchPercentage, setMatchPercentage] = useState<string>('0.00');

    const handleSwatchIncrementClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette[index].partsInMix++;  // Increment partsInMix for the clicked swatch
        setPalette(updatedPalette);
    }

    const handleSwatchDecrementClick = (index: number) => {
        const updatedPalette = [...palette];
        if (updatedPalette[index].partsInMix > 0)
            updatedPalette[index].partsInMix--;
        setPalette(updatedPalette);
    }

    const toggleUseTargetColor = () => {
        setUseTargetHsva(!useTargetHsva);
        setShowTargetHsvaPicker(true);
    }

    const handleRemoveFromPaletteClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette.splice(index, 1);  // Remove swatch from palette
        setPalette(updatedPalette);
    }

    const confirmColor = () => {
        if(selectedHsva) {
            const selectedRgbString = tinycolor(selectedHsva).toRgbString();
            addToPalette(selectedRgbString, palette);
            setShowColorPicker(false); // Close the color picker after adding	            setShowColorPicker(false); // Close the color picker after adding
        }
    }

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
    }

    const makeColorSwatches = () => {
        if (palette.length) {
            return palette.map((swatch, i) => {
                return (
                    <div className="swatch-container">
                        <div
                            key={i}
                            className="swatch"
                            style={{backgroundColor: `${swatch.rgbString}`}}
                        >
                            <div className="swatch-ui">
                                <button
                                    className="remove-from-palette"
                                    onClick={() => handleRemoveFromPaletteClick(i)}
                                    style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                >
                                    X
                                </button>
                                {editingLabelIndex === i ? (
                                    <input
                                        value={tempLabel}
                                        onChange={(e) => setTempLabel(e.target.value)}
                                        onBlur={() => {
                                            const updatedPalette = [...palette];
                                            updatedPalette[i].label = tempLabel;
                                            setPalette(updatedPalette);
                                            setEditingLabelIndex(null);
                                        }}
                                        style={{
                                            color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black',
                                            backgroundColor: tinycolor(swatch.rgbString).isDark() ? 'black' : 'white'
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                        <div className='label'
                                            onClick={() => {
                                                setEditingLabelIndex(i);
                                                setTempLabel(swatch.label);
                                            }}
                                            style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                        >

                                                {swatch.label}
                                        </div>
                                )}
                                <div
                                    className="partsInMix"
                                    onClick={() => handleSwatchIncrementClick(i)}
                                    style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}>
                                    {swatch.partsInMix}
                                </div>
                            </div>

                        </div>
                        <div className='change-parts-qty'>
                            <button className="subtract-parts" onClick={() => handleSwatchDecrementClick(i)}>-</button>
                        </div>

                    </div>
                )
            })
        }
    }

    let paletteSwatches = makeColorSwatches();

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
        const normalizedColor = normalizeRgbString(rgbString);
        return palette.some(swatch => normalizeRgbString(swatch.rgbString) === normalizedColor);
    }

    const addToPalette = async (rgbString: string, palette: ColorPart[]) => {
        if (!isColorInPalette(rgbString, palette)) { // Only add if the color is not in the palette
            let updatedPalette = [...palette];
            const hexColor = tinycolor(rgbString).toHexString();
            const colorName = await fetchColorName(hexColor.substring(1)); // Remove the '#'
            const recipe = palette.filter(color => color.partsInMix > 0);
            updatedPalette.push({
                "rgbString": rgbString,
                "label": colorName,
                "partsInMix": 0,
                "recipe": recipe //records colors used in a mix so it can be reconstructed
            });
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", rgbString);
        }
    };

    const getRgbColorMatch = (color1: string, color2: string): number => {
        const color1Lab = xyzToLab(rgbToXyz(tinycolor(color1).toRgb()));
        const color2Lab = xyzToLab(rgbToXyz(tinycolor(color2).toRgb()));
        return (100-deltaE94(color1Lab, color2Lab)); //convert % difference to % match
    }



    const resetMix = () => {
        const resetPalette = palette.map(color => ({
            ...color,
            partsInMix: 0
        }));
        setPalette(resetPalette);
    }

    useEffect(() => {
        setMixedColor(getMixedRgbStringFromPalette(palette));
    }, [palette]);

    useEffect(() => {
        setMatchPercentage(getRgbColorMatch((mixedColor), (hsvaToRgbaString(targetHsva))).toFixed(2));
    }, [mixedColor, targetHsva]);


    return (
        <>
            <main className='Mixer'>
                <div className='color-box'>
                    <section className='mixed-color-container'
                        style={{
                            backgroundColor: mixedColor,
                            width: '100%',
                            top: '0px',
                            bottom: '0px',
                            left: '0px',
                            position: 'absolute',
                            zIndex: -1,
                            transition: 'background-color 0.25s ease-in-out'
                        }}
                    >
                        {useTargetHsva && (
                            <p className='match-pct' style={{
                                color: tinycolor(mixedColor).isDark() ? 'white' : 'black'
                            }}>
                                <label>Match:</label>
                                {matchPercentage}%
                            </p>
                        )}

                    </section>
                    {useTargetHsva && (
                    <section className='target-color-container'
                        style={{
                            background: hsvaToRgbaString(targetHsva),
                            color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                            display: (useTargetHsva ? 'block' : 'none'),
                            width: '40%',
                            minWidth: '200px',
                            position: 'absolute',
                            top: '0px',
                            bottom: '0px',
                            right: '0px',
                            zIndex: 0,
                            transition: 'background-color 0.1s ease-in-out'
                        }}
                    >

                    {showTargetHsvaPicker && (
                            <>
                                <div className='target-color-box'
                                style={{
                                    background: hsvaToRgbaString(targetHsva),
                                    color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                                    transition: 'background-color 0.1s ease-in-out'
                                }}
                                >
                                <button
                                    className='close-button'
                                    onClick={() => setShowTargetHsvaPicker(false)}
                                    style={{
                                        color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                                        transition: 'color 0.1s ease-in-out'
                                    }}
                                >
                                    x
                                </button>

                                    <Wheel
                                        color={targetHsva}
                                        onChange={(color) => setTargetHsva({...targetHsva, ...color.hsva})}
                                    />
                                    <div className='shade-slider'>
                                        <ShadeSlider
                                            hsva={targetHsva}
                                            onChange={(newShade) => {
                                                setTargetHsva({...targetHsva, ...newShade});
                                            }}
                                        />
                                    </div>
                                    <EditableInputRGBA
                                        hsva={targetHsva}
                                        placement="top"
                                        onChange={(color) => {
                                            setTargetHsva({...targetHsva, ...color.hsva});
                                        }}
                                    />
                                </div>
                        </>
                        )}
                        </section>
                        )}
                    <div className='color-box-ui'>
                        <div>
                            <button
                                className='reset-mix'
                                onClick={resetMix}
                                id='reset-mix'
                                style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                }}
                            >
                                <VscDebugRestart />
                                <label className='button-reset-mix'>Reset</label>
                            </button>
                        </div>

                        <div className='color-box-label'>
                        <button
                            className="add-to-palette"
                            onClick={() => addToPalette(mixedColor, palette)}
                            style={{
                                color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                            }}
                        >
                                <FaArrowDown />
                                <label className='button-save'>Save</label>
                            </button>
                            </div>

                        <button
                            className="toggle-target-color"
                            onClick={toggleUseTargetColor}
                            style={{
                                color: useTargetHsva ? tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black' : (tinycolor(mixedColor).isDark() ? 'white' : 'black')
                                    // tinycolor(mixedColor).isDark() ? 'white' : 'black',
                            }}
                        >
                            {(useTargetHsva ? <TbTargetArrow /> : <TbTargetOff />)}
                            <label className='button-target-color'>Target</label>
                        </button>
                    </div>
                    <div className='transparency-box'></div>
                </div>

                <section className='swatches'>
                    {paletteSwatches}

                    <div className="add-color-ui">
                        <button
                            style={{
                                visibility: (showColorPicker) ? 'hidden' : 'visible',
                                display: (showColorPicker) ? 'none' : 'block',
                                cursor: (showColorPicker) ? 'default' : 'pointer'
                            }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            <MdAddCircleOutline/>
                        </button>

                        {showColorPicker && (
                            <>
                                <div
                                    className='popover-box'
                                    style={{background: hsvaToRgbaString(selectedHsva)}}
                                >
                                        <Wheel
                                            color={selectedHsva}
                                            onChange={(color) => setSelectedHsva({...selectedHsva, ...color.hsva})}
                                        />
                                        <div className='shade-slider'>
                                            <ShadeSlider
                                                hsva={selectedHsva}
                                                onChange={(newShade) => {
                                                    setSelectedHsva({...selectedHsva, ...newShade});
                                                }}
                                            />
                                        </div>
                                        <EditableInputRGBA
                                            hsva={selectedHsva}
                                            placement="top"
                                            onChange={(color) => {
                                                setSelectedHsva({...selectedHsva, ...color.hsva});
                                            }}
                                        />
                                    <button onClick={confirmColor}>
                                        Add
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Mixer;
