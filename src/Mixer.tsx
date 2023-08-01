import React from 'react';
import {useState} from 'react';

import './style.css';

export default function Mixer () {
    const [currentColor, setCurrentColor] = useState('rgb(0, 33, 255)')
    const [palette, setPalette] = useState([
        ['Cadmium Yellow', '#feec00', 0],
        ['Hansa Yellow', '#fcd300', 0],
        ['Cadmium Orange', '#ff6900', 0],
        ['Cadmium Red', '#ff2702', 0],
        ['Quinacridone Magenta', '#80022e', 0],
        ['Cobalt Violet', '#4e0042', 0],
        ['Ultramarine Blue', '#190059', 0],
        ['Cobalt Blue', '#002185', 0],
        ['Phthalo Blue', '#0d1b44', 0],
        ['Phthalo Green', '#003c32', 0],
        ['Permanent Green', '#076d16', 0],
        ['Sap Green', '#6b9404', 0],
        ['Burnt Sienna', '#7b4800', 0],
        ['Burnt Umber', '#4e2a04', 0]])
    return (
    <div className='mixer'>
        <div style= {{backgroundColor: currentColor}} className='color-box'></div>
    </div>
    );
}
