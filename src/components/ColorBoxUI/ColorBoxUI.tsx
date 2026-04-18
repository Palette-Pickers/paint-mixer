import React, { useMemo } from 'react'
import styles from './ColorBoxUI.module.scss'
import { ColorPart } from '../../types/types'

//color conversion libraries
import tinycolor from "tinycolor2"
import { hsvaToRgba } from '@uiw/color-convert'

//SVG icons
import { FaArrowDown } from 'react-icons/fa'
import { TbTargetArrow, TbTargetOff } from 'react-icons/tb'
import { VscDebugRestart } from 'react-icons/vsc'

interface ColorBoxUIProps {
    mixedColor: string
    setMixedColor: React.Dispatch<React.SetStateAction<string>>
    isUsingTargetColor: boolean
    targetColor: any
    resetPalette: () => void
    toggleIsUsingTargetColor: () => void
    isSavable: boolean
    addToPalette: (color: string, includeRecipe: boolean) => void
    hasPartsInMix: () => boolean
}

const ColorBoxUI: React.FC<ColorBoxUIProps> = ({ mixedColor, isUsingTargetColor, targetColor, resetPalette, toggleIsUsingTargetColor, isSavable, addToPalette, hasPartsInMix }) => {
    const mixedIsDark = useMemo(() => tinycolor(mixedColor).isDark(), [mixedColor])
    const targetIsDark = useMemo(() => tinycolor(hsvaToRgba(targetColor)).isDark(), [targetColor])
    const contrastColor = mixedIsDark ? 'white' : 'black'
    const targetContrastColor = isUsingTargetColor ? (targetIsDark ? 'white' : 'black') : contrastColor

    return (
        <div className={ styles.ColorBoxUi }>
            <div>
                <button
                    className={ styles.resetMix }
                    onClick={ resetPalette }
                    id='reset-mix'
                    style={ {
                        color: contrastColor,
                        opacity: hasPartsInMix() ? 0.5 : 0
                    } }
                >
                    <VscDebugRestart />
                    <label className={ styles.buttonResetMix }>Reset</label>
                </button>
            </div>
            <div className={ styles.colorBoxLabel }>
                <button
                    className={ styles.addToPalette }
                    onClick={ () => addToPalette(mixedColor, true) }
                    disabled={ !isSavable }
                    style={ {
                        color: contrastColor,
                        opacity: isSavable ? 1 : 0.5
                    } }
                >
                    <FaArrowDown style={ {
                        color: contrastColor,
                        opacity: isSavable ? 1 : 0
                    } } />
                    <label className={ styles.buttonSave }>
                        { isSavable ? 'Save' : 'Saved' }
                    </label>
                </button>
            </div>
            <button
                className={ styles.toggleTargetColor }
                onClick={ toggleIsUsingTargetColor }
                style={ { color: targetContrastColor } }
            >
                { isUsingTargetColor ?
                    <TbTargetArrow data-testid="target-arrow-icon" /> :
                    <TbTargetOff data-testid="target-off-icon" /> }
                <label className={ styles.buttonTargetColor }>Target</label>
            </button>
        </div>
    )
}

export default ColorBoxUI
