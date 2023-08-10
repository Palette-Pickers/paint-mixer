import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';

interface ColorPart {
    label?: string;
    partsInMix: number;
    color: string;
}

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState('rgb(0, 0, 0)');
    const paletteColors = [
        {"label": "White", "color": "rgb(255, 255, 255)", "partsInMix": 0},
        {"label": "Cadmium Yellow", "color": "rgb(254, 236, 0)", "partsInMix": 0},
        {"label": "Hansa Yellow", "color": "rgb(252, 211, 0)", "partsInMix": 0},
        {"label": "Cadmium Orange", "color": "rgb(255, 105, 0)", "partsInMix": 0},
        {"label": "Cadmium Red", "color": "rgb(255, 39, 2)", "partsInMix": 0},
        {"label": "Quinacridone Magenta", "color": "rgb(78, 0, 66)", "partsInMix": 0},
        {"label": "Cobalt Violet", "color": "rgb(150, 0, 255)", "partsInMix": 0},
        {"label": "Ultramarine Blue", "color": "rgb(25, 0, 89)", "partsInMix": 0},
        {"label": "Cerulean Blue", "color": "rgb(0, 33, 133)", "partsInMix": 0},
        {"label": "Phthalo Blue", "color": "rgb(13, 27, 68)", "partsInMix": 0},
        {"label": "Phthalo Green", "color": "rgb(0, 60, 50)", "partsInMix": 0},
        {"label": "Permanent Green", "color": "rgb(7, 109, 22)", "partsInMix": 0},
        {"label": "Sap Green", "color": "rgb(107, 148, 4)", "partsInMix": 0},
        {"label": "Burnt Sienna", "color": "rgb(123, 72, 0)", "partsInMix": 0},
        {"label": "Black", "color": "rgb(0, 0, 0)", "partsInMix": 0},
    ];

    const [palette, setPalette] = useState(paletteColors);

    let mix_t: number[] = [];

    const makeColorSwatches = () => {
        if (palette.length) {
            return palette.map((swatch, i) => {
                return (
                    <div
                        key={i}
                        className="swatch"
                        style={{backgroundColor: `${swatch.color}`}}
                        onClick={() => handleSwatchIncrementClick(i)}>
                        <div className="partsInMix">{swatch.partsInMix}</div>
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

    const getMixedColorFromPalette = (palette) => {
        let totalParts = 0;
        for (let i = 0; i < palette.length; i++) {
            totalParts += palette[i].partsInMix;
            mix_t.push(0);
        }

        if (totalParts > 0.000001) {
            let latent_mix = [0, 0, 0, 0, 0, 0, 0];
            for (let j = 0; j < palette.length; j++) {
                if(palette[j].partsInMix > 0.000001) {
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
    }

    let paletteSwatches = makeColorSwatches();

    const addToPalette = (color, palette) => {
        const newPalette = mixbox(color, palette.length + 1);
        setPalette(newPalette);
    }

    useEffect(() => {
        setMixedColor(getMixedColorFromPalette(palette));
    }, [palette]);

    return (
    <div className='Mixer'>
            <div style={{backgroundColor: mixedColor}} className='color-box'></div>
            <div className='swatches'>
                {paletteSwatches}
            </div>
    </div>
    );
}

export default Mixer;
