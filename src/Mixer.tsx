import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import {SketchPicker} from 'react-color'; // Import the color picker
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider'
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';;
import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
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
    const [targetColor, setTargetColor] = useState<string>('rgb(0,0,0)');
    const [useTargetColor, setUseTargetColor] = useState<boolean>(false);
    const [showTargetColorPicker, setShowTargetColorPicker] = useState<boolean>(false); // State to toggle color picker

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
        setUseTargetColor(!useTargetColor);
    }

    const handleRemoveFromPaletteClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette.splice(index, 1);  // Remove swatch from palette
        setPalette(updatedPalette);
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
        else return 'rgba(0,0,0,0)';
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

    const confirmColor = () => {
        if (selectedHsva) {
            const selectedColor = hsvaToRgba(selectedHsva);
            addToPalette(`rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`, palette);
            setShowColorPicker(false); // Close the color picker after adding
        }
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
                <section
                    style={{backgroundColor: mixedColor}}
                    className='color-box'
                >
                    <div className='color-box-ui'>
                        <button
                            className="reset-mix"
                            onClick={resetMix}
                        >
                            🔄 Reset Mix
                        </button>
                        <button
                            className="add-to-palette"
                            onClick={() => addToPalette(mixedColor, palette)}
                        >
                            Add ⬇️
                        </button>
                        <button
                            className="toggle-target-color"
                            onClick={toggleUseTargetColor}
                            style={{
                                background: useTargetColor ? 'rgb(255, 152, 9)' : 'darkgray'}}
                        >Use Target Color</button>
                    </div>
                    <div className='transparency-box'></div>
                </section>

                <section className='swatches'>
                    {paletteSwatches}

                    <div className="add-color-ui">
                        <button
                            style={{
                                visibility: (showColorPicker) ? 'hidden' : 'visible',
                                display: (showColorPicker) ? 'none' : 'block'
                            }}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            +
                        </button>

                        {showColorPicker && (
                            <>
                                <div
                                    className='popover-box'
                                    style={{background: hsvaToRgbaString(selectedHsva)}}>
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
