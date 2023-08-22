import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import {SketchPicker} from 'react-color'; // Import the color picker
import Wheel from "@uiw/react-color-wheel";
import { hsvaToRgba, hsvaToRgbaString } from '@uiw/color-convert';




interface ColorPart {
    label: string;
    partsInMix: number;
    color: string;
}

interface RGBColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState('rgb(0,0,0)');
    const paletteColors = [
        {"label": "White", "color": "rgb(255,255,255)", "partsInMix": 0},
        {"label": "Cadmium Yellow", "color": "rgb(254,236,0)", "partsInMix": 0},
        {"label": "Hansa Yellow", "color": "rgb(252,211,0)", "partsInMix": 0},
        {"label": "Cadmium Orange", "color": "rgb(255,105,0)", "partsInMix": 0},
        {"label": "Cadmium Red", "color": "rgb(255,39,2)", "partsInMix": 0},
        {"label": "Quinacridone Magenta", "color": "rgb(78,0,66)", "partsInMix": 0},
        {"label": "Cobalt Violet", "color": "rgb(150,0,255)", "partsInMix": 0},
        {"label": "Ultramarine Blue", "color": "rgb(25,0,89)", "partsInMix": 0},
        {"label": "Cerulean Blue", "color": "rgb(0,33,133)", "partsInMix": 0},
        {"label": "Phthalo Blue", "color": "rgb(13,27,68)", "partsInMix": 0},
        {"label": "Phthalo Green", "color": "rgb(0,60,50)", "partsInMix": 0},
        {"label": "Permanent Green", "color": "rgb(7,109,22)", "partsInMix": 0},
        {"label": "Sap Green", "color": "rgb(107,148,4)", "partsInMix": 0},
        {"label": "Burnt Sienna", "color": "rgb(123,72,0)", "partsInMix": 0},
        {"label": "Black", "color": "rgb(0,0,0)", "partsInMix": 0},
    ];

    const [palette, setPalette] = useState(paletteColors);
    const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker
    const [selectedColor, setSelectedColor] = useState<RGBColor>({r: 255, g: 255, b: 255});
    const [selectedHsva, setSelectedHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });

    const makeColorSwatches = () => {
        if (palette.length) {
            return palette.map((swatch, i) => {
                return (
                <div className="swatch-container">
                    <div
                        key={i}
                        className="swatch"
                        style={{backgroundColor: `${swatch.color}`}}
                    >
                        <div className="swatch-ui">
                            <button className="remove-from-palette" onClick={() => handleRemoveFromPaletteClick(i)}>X</button>
                            <div className='label'>{swatch.label}</div>
                            <div className='change-parts-qty'>
                                <button className="subtract-parts" onClick={() => handleSwatchDecrementClick(i)}>-</button>
                                <div className="partsInMix">{swatch.partsInMix}</div>
                                <button className="add-parts" onClick={() => handleSwatchIncrementClick(i)}>+</button>
                            </div>
                        </div>
                    </div>
                </div>
                )
            })
        }
    }

    const handleSwatchIncrementClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette[index].partsInMix++;  // Increment partsInMix for the clicked swatch
        setPalette(updatedPalette);
    }

    const handleSwatchDecrementClick = (index: number) => {
        const updatedPalette = [...palette];
        if (updatedPalette[index].partsInMix > 0)
            updatedPalette[index].partsInMix--;  // Decrement partsInMix for the clicked swatch
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
            return mixed_color;
        }
        else return 'rgba(0,0,0,0)';
    }

    let paletteSwatches = makeColorSwatches();

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

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (color: string, palette: ColorPart[]): boolean => {
        const normalizedColor = normalizeRGB(color);
        return palette.some(swatch => normalizeRGB(swatch.color) === normalizedColor);
    }

    const addToPalette = (color: string, palette: ColorPart[]) => {
        if (!isColorInPalette(color, palette)) { // Only add if the color is not in the palette
            let updatedPalette = [...palette];
            updatedPalette.push({ "color": color, "label": normalizeRGB(color), "partsInMix": 0 });
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", color);
        }
    }


    const handleColorChange = (color: { rgb: RGBColor }) => {
        setSelectedColor(color.rgb);
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
        <div className='Mixer'>
            <div style={{backgroundColor: mixedColor}} className='color-box'>
                <div className='color-box-ui'>
                    <button className="reset-mix" onClick={resetMix}>Reset</button>
                    <button className="add-to-palette" onClick={() => addToPalette(mixedColor, palette)}>Add to Palette</button>
                </div>
                <div className='transparency-box'></div>
            </div>

            <div className='swatches'>
                {paletteSwatches}
                <button onClick={() => setShowColorPicker(!showColorPicker)}>+</button>
                {showColorPicker && (
                    <div style={{ position: 'absolute', zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'}} onClick={confirmColor} />
                        <div className='popover-box'>
                            <Wheel color={selectedHsva} onChange={(color) => setSelectedHsva({...selectedHsva, ...color.hsva})} />
                            <div className='color-preview' style={{background: hsvaToRgbaString(selectedHsva) }}><button onClick={confirmColor}>Save</button></div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mixer;
