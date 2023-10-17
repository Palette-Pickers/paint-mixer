import React, {useState} from 'react';
import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import tinycolor from "tinycolor2";
import {Hsva} from "../../types/types";
import ColorPicker from '../ColorPicker/ColorPicker';
import {useColorMatching} from '../../data/hooks/useColorMatching';

interface TargetColorContainerProps {
    targetColor: Hsva;
    onColorChange: (color: string) => void; // Callback to handle color changes
}

const TargetColorContainer: React.FC<TargetColorContainerProps> = ({targetColor, onColorChange}) => {

    const [isUsingTargetColor, setIsUsingTargetColor] = useState<boolean>(false);
    const [isShowingTargetColorPicker, setIsShowingTargetColorPicker] = useState<boolean>(false);
    const {colorName: targetColorName} = useColorMatching(hsvaToRgbaString(targetColor));

    return (
        <div className="target-color-container">
            <div className="color-display"
                style={{
                    background: hsvaToRgbaString(targetColor),
                                color: tinycolor(hsvaToRgba(targetColor))?.isDark() ? 'white' : 'black',
                                display: (isUsingTargetColor ? 'block' : 'none'),
                }}
            >
                {/* Display the target color */}
                {isShowingTargetColorPicker && (
                    <ColorPicker
                        color={targetColor}
                        onChange={(newColor) => {
                            setTargetColor(newColor);
                        }}
                        onClose={() => setIsShowingTargetColorPicker(false)}
                        onConfirm={() => {setIsShowingTargetColorPicker(false);}}
                    />
                )}
                {!isShowingTargetColorPicker && (
                    <div className='target-color-values'>
                        <label htmlFor="target-color">Target Color</label>
                        <div id="target-color">
                            {tinycolor(targetColor)?.toHexString()}
                            <p>{targetColorName}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TargetColorContainer;
