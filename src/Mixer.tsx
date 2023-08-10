import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';

import './Mixer.scss';

export default function Mixer () {
    const [currentColor, setCurrentColor] = useState('rgb(0, 0, 0)');
    const [mixingRatio, setMixingRatio] = useState(0.5);
    const paletteColors = [
        {"label": "Cadmium Yellow", "color": "rgb(254, 236, 0)", "partsInMix": 1},
        {"label": "Hansa Yellow", "color": "rgb(252, 211, 0)", "partsInMix": 0},
        {"label": "Cadmium Orange", "color": "rgb(255, 105, 0)", "partsInMix": 0},
        {"label": "Cadmium Red", "color": "rgb(255, 39, 2)", "partsInMix": 0},
        {"label": "Quinacridone Magenta", "color": "rgb(78, 0, 66)", "partsInMix": 0},
        {"label": "Cobalt Violet", "color": "rgb(150, 0, 255)", "partsInMix": 0},
        {"label": "Ultramarine Blue", "color": "rgb(25, 0, 89)", "partsInMix": 0},
        {"label": "Cerulean Blue", "color": "rgb(0, 33, 133)", "partsInMix": 1},
        {"label": "Phthalo Blue", "color": "rgb(13, 27, 68)", "partsInMix": 0},
        {"label": "Phthalo Green", "color": "rgb(0, 60, 50)", "partsInMix": 0},
        {"label": "Permanent Green", "color": "rgb(7, 109, 22)", "partsInMix": 0},
        {"label": "Sap Green", "color": "rgb(107, 148, 4)", "partsInMix": 0},
        {"label": "Burnt Sienna", "color": "rgb(123, 72, 0)", "partsInMix": 0}
    ];
    const [palette, setPalette] = useState(paletteColors);
    const numPigments = palette.length;

    let mix_t = []

    const makeColorSwatches = () => {
        if (palette.length) {
            return palette.map((swatch, i) => {
                return (
                    <div key={i} className="swatch" style={{backgroundColor: `${swatch.color}`}}>
                        {swatch.partsInMix}
                    </div>
                )
            })
        }
    }

    const mixColors = (color1, color2, mixingRatio) => {
        let mixed = mixbox.lerp(color1, color2, mixingRatio);
        console.log('Current color + first swatch makes '+mixed);
    }

    const mixColorFromPalette = (palette) => {
        let totalParts = 0;
        for (let i = 0; i < palette.length; i++) {
            totalParts += palette[i].partsInMix;
            mix_t.push(0);
        }
        console.log('Total parts of paint used is ' + totalParts);
        if (totalParts > 0.000001) {
            let latent_mix = [0, 0, 0, 0, 0, 0, 0];
            for (let j = 0; j < palette.length; j++) {
                if(palette[j].partsInMix > 0.000001) {
                    let latent = mixbox.rgbToLatent(palette[j].color);
                    console.log('latent is ' + latent);
                    let percentageUsedInMix = palette[j].partsInMix / totalParts;
                    for (let k = 0; k < latent.length; k++) {
                        latent_mix[k] += latent[k] * percentageUsedInMix;
                    }
                }
            }
            let mixed_color = mixbox.latentToRgb(latent_mix);
            console.log('Mixed color is ' + mixed_color);
            return mixed_color;
        }
    }

    let paletteSwatches = makeColorSwatches();

    const addToPalette = (color, palette) => {
        const newPalette = mixbox(color, palette.length + 1);
        setPalette(newPalette);
    }

useEffect(() => {
    mixColorFromPalette(palette);
}, [palette]);


    useEffect(() => {
        //Todo: combine the clicked swatch with the current color
        mixColors(currentColor, palette[0].color, 0.5);
    }, []);

    return (
    <div className='Mixer'>
            <div style={{backgroundColor: currentColor}} className='color-box'></div>
            <div className='swatches'>
                {paletteSwatches}
            </div>
    </div>
    );
}
