import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import styles from './Mixer.module.scss'

//components
import AddColorUIComponent from '../AddColorUIComponent/AddColorUIComponent'
import ColorBoxUI from '../ColorBoxUI/ColorBoxUI'
import MixGraph from '../MixGraph/MixGraph'
import ColorSwatches from '../ColorSwatches/ColorSwatches'
import MixedColorContainer from '../MixedColorContainer/MixedColorContainer'
import TargetColorContainer from '../TargetColorContainer/TargetColorContainer'

//color mixing and conversion libraries
import { rgbToXyz, xyzToLab, deltaE94, normalizeRgbString } from '../../utils/colorConversion'
import mixbox from 'mixbox'
import tinycolor from "tinycolor2"
import { hsvaToRgbaString } from '@uiw/color-convert'

//custom hooks
import usePaletteManager from '../../data/hooks/usePaletteManager'
import { useColorMatching } from '../../data/hooks/useColorMatching'
import { useLocalStorage } from '../../data/hooks/useLocalStorage'
import { useTheme } from '../../data/hooks/useTheme'

import { defaultPalette } from '../../utils/palettes/defaultPalette'
import { ColorPart } from '../../types/types'
import { useColorSolver } from '../../data/hooks/useColorSolver'
import { MdSettings, MdLightMode, MdDarkMode } from 'react-icons/md'

const getMixedRgbStringFromPalette = (palette: ColorPart[]): string => {
    const totalParts = palette.reduce((acc, color) => acc + color.partsInMix, 0)

    if (totalParts > 0.000001) {
        let latent_mix: number[] = [ 0, 0, 0, 0, 0, 0, 0 ]

        for (let j = 0; j < palette.length; j++) {
            if (palette[ j ].partsInMix > 0.000001) {
                const latent = mixbox.rgbToLatent(palette[ j ].rgbString)
                if (latent !== undefined) {
                    const percentageUsedInMix = palette[ j ].partsInMix / totalParts
                    for (let k = 0; k < latent.length; k++) {
                        latent_mix[ k ] += latent[ k ] * percentageUsedInMix
                    }
                }
            }
        }
        const mixed_color = mixbox.latentToRgb(latent_mix)
        return normalizeRgbString(mixed_color)
    }

    return tinycolor('rgba(255,255,255,0)').toRgbString() ?? ''
}

const getRgbColorMatch = (color1: string, color2: string): number => {
    if (!color1 || !color2) return 0
    const color1Rgb = tinycolor(color1)?.toRgb()
    const color2Rgb = tinycolor(color2)?.toRgb()
    if (!color1Rgb || !color2Rgb) return 0
    const color1Lab = xyzToLab(rgbToXyz(color1Rgb))
    const color2Lab = xyzToLab(rgbToXyz(color2Rgb))
    return 100 - deltaE94(color1Lab, color2Lab)
}

const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
    const normalizedColor = tinycolor(normalizeRgbString(rgbString)).toHexString()
    return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor)
}

const Mixer: React.FC = () => {
    const { theme, toggleTheme } = useTheme()

    const [ showAddColorPicker, setShowAddColorPicker ] = useState(false)
    const [ showPreferences, setShowPreferences ] = useState(false)
    const [ isNearGear, setIsNearGear ] = useState(false)
    const gearRef = useRef<HTMLButtonElement>(null)
    const bannerRef = useRef<HTMLDivElement>(null)
    const [ addColor, setAddColor ] = useState({ h: 214, s: 43, v: 90, a: 1 })
    const [ isUsingTargetColor, setIsUsingTargetColor ] = useState<boolean>(false)
    const [ targetColor, setTargetColor ] = useState({ h: 214, s: 43, v: 90, a: 1 })
    const [ isShowingTargetColorPicker, setIsShowingTargetColorPicker ] = useState<boolean>(false)
    const [ precisionMode, setPrecisionMode ] = useLocalStorage('precisionMode', false)

    const [ savedPalette ] = useLocalStorage('savedPalette', defaultPalette)
    const initialPalette: (any) = savedPalette

    const {
        palette,
        handleSwatchIncrement,
        handleSwatchDecrement,
        handleRemoveFromPalette,
        resetPalette,
        addToPalette,
        updateColorName,
        applyMix,
    } = usePaletteManager(initialPalette)

    // Derived values — no useEffect chains, no cascading re-renders
    const mixedColor = useMemo(() => getMixedRgbStringFromPalette(palette), [ palette ])
    const totalParts = useMemo(() => palette.reduce((acc, color) => acc + color.partsInMix, 0), [ palette ])
    const targetRgbaString = useMemo(() => hsvaToRgbaString(targetColor), [ targetColor ])
    const matchPercentage = useMemo(
        () => getRgbColorMatch(mixedColor, targetRgbaString).toFixed(2),
        [ mixedColor, targetRgbaString ]
    )
    const isSavable = useMemo(() => !isColorInPalette(mixedColor, palette), [ mixedColor, palette ])
    const hasPartsInMix = useMemo(() => palette.some(color => color.partsInMix > 0), [ palette ])

    const { colorName: mixedColorName } = useColorMatching(mixedColor)
    const { colorName: targetColorName } = useColorMatching(targetRgbaString)

    const { result: solverResult, isRunning: solverRunning } = useColorSolver(
        palette,
        targetRgbaString,
        isUsingTargetColor && palette.length > 0,
        precisionMode
    )

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!gearRef.current) return
            const rect = gearRef.current.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            setIsNearGear(Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2) < 100)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        if (!showPreferences) return
        const handleClickOutside = (e: MouseEvent) => {
            if (
                bannerRef.current && !bannerRef.current.contains(e.target as Node) &&
                gearRef.current && !gearRef.current.contains(e.target as Node)
            ) {
                setShowPreferences(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [ showPreferences ])

    const toggleIsUsingTargetColor = useCallback(() => {
        setIsUsingTargetColor(prev => !prev)
        setIsShowingTargetColorPicker(true)
    }, [])

    const confirmColor = useCallback(() => {
        if (addColor) {
            const selectedRgbString = tinycolor(addColor)?.toRgbString() ?? ''
            addToPalette(selectedRgbString, false)
            setShowAddColorPicker(false)
        }
    }, [ addColor, addToPalette ])

    return (
        <main className={ styles.Mixer }>
            <div className={ styles.colorBox }>

                <MixedColorContainer
                    mixedColor={ mixedColor }
                    mixedColorName={ mixedColorName }
                    isUsingTargetColor={ isUsingTargetColor }
                    matchPercentage={ matchPercentage }
                />

                <TargetColorContainer
                    isUsingTargetColor={ isUsingTargetColor }
                    targetColor={ targetColor }
                    isShowingTargetColorPicker={ isShowingTargetColorPicker }
                    targetColorName={ targetColorName }
                    setTargetColor={ setTargetColor }
                    setIsShowingTargetColorPicker={ setIsShowingTargetColorPicker }
                />

                <ColorBoxUI
                    mixedColor={ mixedColor }
                    isUsingTargetColor={ isUsingTargetColor }
                    targetColor={ targetColor }
                    resetPalette={ resetPalette }
                    toggleIsUsingTargetColor={ toggleIsUsingTargetColor }
                    isSavable={ isSavable }
                    addToPalette={ addToPalette }
                    hasPartsInMix={ hasPartsInMix }
                />

                <div className={ styles.transparencyBox }>
                </div>
            </div>

            <MixGraph
                palette={ palette }
                totalParts={ totalParts }
            />

            { isUsingTargetColor && (
                <div className={ styles.solverBanner } data-testid="solver-banner">
                    <span className={ styles.solverLabel }>
                        { solverRunning ? 'Solving…' : 'Suggested Mix:' }
                    </span>
                    { !solverRunning && solverResult && (
                        <>
                            <div className={ styles.solverChips }>
                                { solverResult.mix.map(({ index, parts }) => (
                                    <span key={ index } className={ styles.solverChip }>
                                        <span
                                            className={ styles.chipSwatch }
                                            style={ { background: palette[index]?.rgbString } }
                                        />
                                        { palette[index]?.label } × { parts }
                                    </span>
                                )) }
                            </div>
                            <span className={ styles.solverMatch }>
                                { solverResult.matchPercentage }% match
                            </span>
                            <button
                                className={ styles.solverApply }
                                onClick={ () => applyMix(solverResult.mix) }
                            >
                                Apply
                            </button>
                        </>
                    ) }
                    <label className={ styles.precisionLabel }>
                        <input
                            type="checkbox"
                            checked={ precisionMode }
                            disabled={ solverRunning }
                            onChange={ e => setPrecisionMode(e.target.checked) }
                        />
                        Precision mode
                    </label>
                </div>
            ) }

            <ColorSwatches
                palette={ palette }
                handleSwatchIncrement={ handleSwatchIncrement }
                handleSwatchDecrement={ handleSwatchDecrement }
                handleRemoveFromPalette={ handleRemoveFromPalette }
                updateColorName={ updateColorName }
                totalParts={ totalParts }
            />

            { showPreferences && (
                <div ref={ bannerRef } className={ styles.preferencesBanner } data-testid="preferences-banner">
                    <label className={ styles.preferencePrecisionLabel }>
                        <input
                            type="checkbox"
                            checked={ precisionMode }
                            disabled={ solverRunning }
                            onChange={ e => setPrecisionMode(e.target.checked) }
                        />
                        Suggested Mix Precision mode
                    </label>
                    <button
                        className={ styles.preferenceThemeButton }
                        onClick={ toggleTheme }
                        aria-label={ theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode' }
                    >
                        <span className={ styles.preferenceThemeLabel }>
                            { theme === 'dark' ? 'Light mode' : 'Dark mode' }
                        </span>
                        { theme === 'dark' ? <MdLightMode /> : <MdDarkMode /> }
                    </button>
                </div>
            ) }

            <button
                ref={ gearRef }
                className={ `${ styles.gearButton }${ isNearGear || showPreferences ? ` ${ styles.gearVisible }` : '' }` }
                onClick={ () => setShowPreferences(prev => !prev) }
                aria-label="Preferences"
                data-testid="gear-button"
            >
                <MdSettings />
            </button>

            <AddColorUIComponent
                showAddColorPicker={ showAddColorPicker }
                addColor={ addColor }
                setShowAddColorPicker={ setShowAddColorPicker }
                setAddColor={ setAddColor }
                confirmColor={ confirmColor }
                addToPalette={ addToPalette }
            />
        </main>
    )
}

export default Mixer
