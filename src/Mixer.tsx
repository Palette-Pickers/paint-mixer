import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';

import './style.css';

export default function Mixer () {
    const [currentColor, setCurrentColor] = useState('rgb(0, 33, 255)');
    const [palette, setPalette] = useState([
        [{ label: 'Cadmium Yellow', color: 'rgb(254, 236, 0)' }],
        [{ label: 'Hansa Yellow', color: 'rgb(252, 211, 0)' }],
        [{ label: 'Cadmium Orange', color: 'rgb(255, 105, 0)' }],
        [{ label: 'Cadmium Red', color: 'rgb(255, 39, 2)' }],
        [{ label: 'Quinacridone Magenta', color: 'rgb(78, 0, 66)' }],
        [{ label: 'Cobalt Violet', color: 'rgb(150, 0, 255)'}],
        [{ label: 'Ultramarine Blue', color: 'rgb(25, 0, 89)' }],
        [{ label: 'Cerulean Blue', color: 'rgb(0, 33, 133)' }],
        [{ label: 'Phthalo Blue', color: 'rgb(13, 27, 68)' }],
        [{ label: 'Phthalo Green', color: 'rgb(0, 60, 50)' }],
        [{ label: 'Permanent Green', color: 'rgb(7, 109, 22)' }],
        [{ label: 'Sap Green', color: 'rgb(107, 148, 4)' }],
        [{ label: 'Burnt Sienna', color: 'rgb(123, 72, 0)' }],
    ])

    useEffect(() => {
        setPalette([
            [{ label: 'Cadmium Yellow', color: 'rgb(254, 236, 0)'}],
            [{ label: 'Hansa Yellow', color: 'rgb(252, 211, 0)' }],
            [{ label: 'Cadmium Orange', color: 'rgb(255, 105, 0)' }],
            [{ label: 'Cadmium Red', color: 'rgb(255, 39, 2)' }],
            [{ label: 'Quinacridone Magenta', color: 'rgb(78, 0, 66)' }],
            [{ label: 'Cobalt Violet', color: 'rgb(150, 0, 255)'}],
            [{ label: 'Ultramarine Blue', color: 'rgb(25, 0, 89)' }],
            [{ label: 'Cerulean Blue', color: 'rgb(0, 33, 133)' }],
            [{ label: 'Phthalo Blue', color: 'rgb(13, 27, 68)' }],
            [{ label: 'Phthalo Green', color: 'rgb(0, 60, 50)' }],
            [{ label: 'Permanent Green', color: 'rgb(7, 109, 22)' }],
            [{ label: 'Sap Green', color: 'rgb(107, 148, 4)' }],
            [{ label: 'Burnt Sienna', color: 'rgb(123, 72, 0)' }]
        ]);
        setCurrentColor('rgb(255, 255, 255)');
    }, [palette]);

    return (
    <div className='mixer'>
            <div style={{backgroundColor: currentColor}} className='color-box'></div>
            <div className='palette'>


            </div>

    </div>
    );
}
