import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import {SketchPicker} from 'react-color'; // Import the color picker
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider'
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';;
import {hsvaToRgba, hsvaToRgbaString, hsvaToHex, rgbaStringToHsva} from '@uiw/color-convert';
import isDark from "./utils/isDark";
import {defaultPalette} from './utils/palettes/defaultPalette';
import {
    rgbStringToRgb,
    normalizeRGB,
    sRGBToLinear,
    rgbToXyz,
    xyzToLab,
    deltaE94
} from './utils/colorConversion';

import {IoColorPalette} from 'react-icons/io5';
import {TbTargetArrow, TbTargetOff, TbTarget} from 'react-icons/tb';
import {VscDebugRestart} from 'react-icons/vsc';
import {MdAddCircleOutline} from 'react-icons/md';
import {FaHandPointUp, FaHandPointDown} from 'react-icons/fa';
import {HiBeaker} from 'react-icons/hi';
import {BsPalette} from 'react-icons/bs';
import {BiTargetLock} from 'react-icons/bi';
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
    const [mixedColor, setMixedColor] = useState<string>('rgb(0,0,0)');
    const [palette, setPalette] = useState<ColorPart[]>(defaultPalette);
    const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker
    const [selectedHsva, setSelectedHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
    const [tempLabel, setTempLabel] = useState<string>('');
    const [targetHsva, setTargetHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [useTargetHsva, setUseTargetHsva] = useState<boolean>(false);
    const [showTargetHsvaPicker, setShowTargetHsvaPicker] = useState<boolean>(false); // State to toggle color picker

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

    const confirmTargetColor = () => {
        setShowTargetHsvaPicker(false);

    }

    const confirmColor = () => {
        if (selectedHsva) {
            const selectedColor = hsvaToRgba(selectedHsva);
            addToPalette(`rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`, palette);
            setShowColorPicker(false); // Close the color picker after adding
        }
    }

    const getMixedColorFromPalette = (palette: ColorPart[]): string => {
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
            return normalizeRGB(mixed_color);
        }
        else return 'rgba(255,255,255,0)';
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
                                <button className="remove-from-palette" onClick={() => handleRemoveFromPaletteClick(i)}
                                style={{color: isDark(rgbStringToRgb(swatch.rgbString)) ? 'white' : 'black'}}>X</button>
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
                                        autoFocus
                                    />
                                ) : (
                                        <div className='label'
                                            onClick={() => {
                                                setEditingLabelIndex(i);
                                                setTempLabel(swatch.label);
                                            }}
                                            style={{color: isDark(rgbStringToRgb(swatch.rgbString)) ? 'white' : 'black'}}
                                        >

                                                {swatch.label}



                                        </div>
                                )}
                                <div
                                    className="partsInMix"
                                    onClick={() => handleSwatchIncrementClick(i)}
                                    style={{color: isDark(rgbStringToRgb(swatch.rgbString)) ? 'white' : 'black'}}>
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
        const normalizedColor = normalizeRGB(rgbString);
        return palette.some(swatch => normalizeRGB(swatch.rgbString) === normalizedColor);
    }

    const addToPalette = (rgbString: string, palette: ColorPart[]) => {
        if (!isColorInPalette(rgbString, palette)) { // Only add if the color is not in the palette
            let updatedPalette = [...palette];
            const recipe= palette.filter(color => color.partsInMix > 0);
            updatedPalette.push({
                "rgbString": rgbString,
                "label": rgbString,
                "partsInMix": 0,
                "recipe": recipe //records colors used in a mix so it can be reconstructed
            });
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", rgbString);
        }
    }

    const compareRgbColors = (color1: string, color2: string): number => {
        const color1Lab = xyzToLab(rgbToXyz(rgbStringToRgb(color1)));
        const color2Lab = xyzToLab(rgbToXyz(rgbStringToRgb(color2)));
        return deltaE94(color1Lab, color2Lab);
    }



    const resetMix = () => {
        const resetPalette = palette.map(color => ({
            ...color,
            partsInMix: 0
        }));
        setPalette(resetPalette);
    }

    useEffect(() => {
        setMixedColor(getMixedColorFromPalette(palette));
    }, [palette]);



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
                            zIndex: -1
                        }}
                    >
                        <p className='match-pct' style={{
                            color: (isDark(rgbStringToRgb(mixedColor)) ? 'white' : 'black'),
                        }}>
                            <label>Match:</label>
                            {(compareRgbColors(mixedColor, hsvaToRgbaString(targetHsva)).toFixed(2))}%
                        </p>

                    </section>
                    <section className='target-color-container'
                        style={{
                            background: hsvaToRgbaString(targetHsva),
                            color: (isDark(hsvaToRgba(targetHsva)) ? 'white' : 'black'),
                            display: (useTargetHsva ? 'block' : 'none'),
                            width: '40%',
                            minWidth: '200px',
                            position: 'absolute',
                            top: '0px',
                            bottom: '0px',
                            right: '0px',
                            zIndex: 0
                        }}
                    >
                    {showTargetHsvaPicker && (
                            <>
                                <div className='target-color-box'
                                style={{
                                    background: hsvaToRgbaString(targetHsva),
                                    color: (isDark(hsvaToRgba(targetHsva)) ? 'white' : 'black')
                                }}
                                >
                                <button
                                    className='close-button'
                                    onClick={() => setShowTargetHsvaPicker(false)}
                                    style={{
                                        color: (isDark(hsvaToRgba(targetHsva)) ? 'white' : 'black')
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
                    <div className='color-box-ui'>
                        <div>
                            <button
                                className='reset-mix'
                                onClick={resetMix}
                                id='reset-mix'
                                style={{
                                    color: (isDark(rgbStringToRgb(mixedColor)) ? 'white' : 'black'),
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
                                color: (isDark(rgbStringToRgb(mixedColor)) ? 'white' : 'black'),
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
                                color: (isDark(rgbStringToRgb(mixedColor)) ? 'white' : 'black'),
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
