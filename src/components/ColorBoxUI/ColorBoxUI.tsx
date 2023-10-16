import React from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import { TbTargetArrow, TbTargetOff } from 'react-icons/tb';
import tinycolor from "tinycolor2";

interface ColorBoxUIProps {
    mixedColor: string;
    isUsingTargetColor: boolean;
    targetColor: any;
    resetPalette: () => void;
    toggleIsUsingTargetColor: () => void;
    isSavable: boolean;
    addToPalette: (color: string, includeRecipe: boolean) => void;
}

const ColorBoxUI: React.FC<ColorBoxUIProps> = ({ mixedColor, isUsingTargetColor, targetColor, resetPalette, toggleIsUsingTargetColor, isSavable, addToPalette }) => {
    return (
        <div className='color-box-ui'>
            <div>
                <button
                    className='reset-mix'
                    onClick={resetPalette}
                    id='reset-mix'
                    style={{
                        color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                        opacity: hasPartsInMix() ? 0.5 : 0 // Change the opacity to indicate it's disabled
                    }}
                >
                    <VscDebugRestart />
                    <label className='button-reset-mix'>Reset</label>
                </button>
            </div>
            <div className='color-box-label'>
                <button
                    className="add-to-palette"
                    onClick={() => addToPalette(mixedColor, true)}  // Set includeRecipe to true
                    disabled={!isSavable} // Disable the button based on canSave state
                    style={{
                        color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                        opacity: isSavable ? 1 : 0.5 // Change the opacity to indicate it's disabled
                    }}
                >
                    <FaArrowDown style={{
                        color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                        opacity: isSavable ? 1 : 0 // Hide the icon when disabled
                    }}
                    />
                    <label className='button-save'>
                        {isSavable ? 'Save' : 'Saved'}
                    </label>
                </button>
            </div>
            <button
                className="toggle-target-color"
                onClick={toggleIsUsingTargetColor}
                style={{
                    color: isUsingTargetColor ?
                        tinycolor(hsvaToRgba(targetColor)).isDark() ? 'white' : 'black' :
                        tinycolor(mixedColor).isDark() ? 'white' : 'black'
                }}
            >
                {(isUsingTargetColor ? <TbTargetArrow /> : <TbTargetOff />)}
                <label className='button-target-color'>Target</label>
            </button>
        </div>
    );
}

export default ColorBoxUI;
