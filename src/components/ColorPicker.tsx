import React, { useState } from 'react';
import styles from './ColorPicker.module.scss';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider';
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';
import tinycolor from "tinycolor2";
import {AiOutlineClose} from 'react-icons/ai';


interface ColorPickerProps {
    color: any;
    onChange: (color: any) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose, onConfirm }) => {
    return (
        <div className={styles.ColorPicker} style={{ background: tinycolor(color).toRgbString() }}>
            <button className={styles.closeButton} onClick={onClose}>
                <AiOutlineClose />
            </button>
            <Wheel color={color} onChange={(newColor) => onChange({ ...color, ...newColor.hsva })} />
            <div className={styles.shadeSlider}>
                <ShadeSlider
                    hsva={color}
                    onChange={(newShade) => onChange({ ...color, ...newShade })}
                />
            </div>
            <EditableInputRGBA hsva={color} placement="top" onChange={(newColor) => onChange({ ...color, ...newColor.hsva })} />
            <button onClick={onConfirm}>Add</button>
        </div>
    );
}


export default ColorPicker;
