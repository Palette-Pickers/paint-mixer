import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import {SketchPicker} from 'react-color'; // Import the color picker
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider'
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';;
import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import isDark from "./utils/isDark";


interface ColorPart {
    label: string;
    partsInMix: number;
    rgbString: string;
}

interface RGBColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}
const normalizeRGB = (color: any): string => {
    if (Array.isArray(color) && color.length >= 3) {
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    } else if (typeof color === 'string') {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
        }
        return color;
    } else {
        console.error('Unexpected format for color:', color);
        return '';
    }
}

const rgbStringToRgb = (rgbString: string): RGBColor => {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
        };
    }
    return {r: 0, g: 0, b: 0};
}

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState('rgb(0,0,0)');
    const paletteColors = [
        {"label": "White", "rgbString": "rgb(255,255,255)", "partsInMix": 0},
        {"label": "Cadmium Yellow", "rgbString": "rgb(254,236,0)", "partsInMix": 0},
        {"label": "Hansa Yellow", "rgbString": "rgb(252,211,0)", "partsInMix": 0},
        {"label": "Cadmium Orange", "rgbString": "rgb(255,105,0)", "partsInMix": 0},
        {"label": "Cadmium Red", "rgbString": "rgb(255,39,2)", "partsInMix": 0},
        {"label": "Quinacridone Magenta", "rgbString": "rgb(78,0,66)", "partsInMix": 0},
        {"label": "Cobalt Violet", "rgbString": "rgb(150,0,255)", "partsInMix": 0},
        {"label": "Ultramarine Blue", "rgbString": "rgb(25,0,89)", "partsInMix": 0},
        {"label": "Cerulean Blue", "rgbString": "rgb(0,33,133)", "partsInMix": 0},
        {"label": "Phthalo Blue", "rgbString": "rgb(13,27,68)", "partsInMix": 0},
        {"label": "Phthalo Green", "rgbString": "rgb(0,60,50)", "partsInMix": 0},
        {"label": "Permanent Green", "rgbString": "rgb(7,109,22)", "partsInMix": 0},
        {"label": "Sap Green", "rgbString": "rgb(107,148,4)", "partsInMix": 0},
        {"label": "Burnt Sienna", "rgbString": "rgb(123,72,0)", "partsInMix": 0},
        {"label": "Black", "rgbString": "rgb(0,0,0)", "partsInMix": 0},
    ];

    const [palette, setPalette] = useState(paletteColors);
    const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker
    const [selectedRgb, setSelectedRgb] = useState<RGBColor>({r: 255, g: 255, b: 255});
    const [selectedHsva, setSelectedHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
    const [tempLabel, setTempLabel] = useState<string>('');

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

    const handleRemoveFromPaletteClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette.splice(index, 1);  // Remove swatch from palette
        setPalette(updatedPalette);
    }

    const getMixedColorFromPalette = (palette) => {
        let totalParts = palette.reduce((acc, color) => {
            return acc + color.partsInMix;
        }, 0);

        if (totalParts > 0.000001) {
            let latent_mix = [0, 0, 0, 0, 0, 0, 0];

            for (let j = 0; j < palette.length; j++) {
                if (palette[j].partsInMix > 0.000001) {
                    const latent = mixbox.rgbToLatent(palette[j].color);
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
    const isColorInPalette = (color: string, palette: ColorPart[]): boolean => {
        const normalizedColor = normalizeRGB(color);
        return palette.some(swatch => normalizeRGB(swatch.rgbString) === normalizedColor);
    }

    const addToPalette = (rgbString: string, palette: ColorPart[]) => {
        if (!isColorInPalette(rgbString, palette)) { // Only add if the color is not in the palette
            let updatedPalette = [...palette];
            updatedPalette.push({ "rgbString": rgbString, "label": normalizeRGB(rgbString), "partsInMix": 0 });
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", rgbString);
        }
    }


    const handleColorChange = (color: { rgb: RGBColor }) => {
        setSelectedRgb(color.rgb);
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
        <main className='Mixer'>
            <section style={{backgroundColor: mixedColor}} className='color-box'>
                <div className='color-box-ui'>
                    <button className="reset-mix" onClick={resetMix}>Reset Mix</button>
                    <button className="add-to-palette" onClick={() => addToPalette(mixedColor, palette)}>Add to Palette</button>
                </div>
                <div className='transparency-box'></div>
            </section>

            <section className='swatches'>
                {paletteSwatches}
                <div className="add-color-ui">
                    <button onClick={() => setShowColorPicker(!showColorPicker)}>+</button>
                    {showColorPicker && (
                        <>
                            <div className='popover-box'>

                                <Wheel color={selectedHsva} onChange={(color) => setSelectedHsva({...selectedHsva, ...color.hsva})} />
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


                                <div className='color-preview' style={{background: hsvaToRgbaString(selectedHsva)}}>
                                    <button onClick={confirmColor}>Save</button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
            </section>
            </main>
    );
}

export default Mixer;
