import React, { useState } from 'react'
import styles from './ColorSwatches.module.scss'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import tinycolor from "tinycolor2"
import { AiOutlineClose } from 'react-icons/ai'
import { FaInfo } from 'react-icons/fa'

interface ColorSwatchesProps {
    palette: any[]
    handleSwatchIncrement: (index: number) => void
    handleSwatchDecrement: (index: number) => void
    handleRemoveFromPalette: (index: number) => void
    updateColorName: (index: number, name: string) => void
    totalParts: number
}

const ColorSwatches: React.FC<ColorSwatchesProps> = ({ palette, handleSwatchIncrement, handleSwatchDecrement, handleRemoveFromPalette, updateColorName, totalParts }) => {

    const [ editingColorNameIndex, setEditingColorNameIndex ] = useState<number | null>(null)
    const [ tempColorName, setTempColorName ] = useState<string>('')
    const [ activeInfoIndex, setActiveInfoIndex ] = useState<number | null>(null)

    return (
        <>
            <div className={ styles.proportionalParts }>
            </div>
            <TransitionGroup className={ styles.ColorSwatches }>
                { palette.map((swatch, i) => {
                    const swatchIsDark = tinycolor(swatch.rgbString).isDark()
                    const swatchContrast = swatchIsDark ? 'white' : 'black'

                    return (
                        <CSSTransition
                            key={ swatch.rgbString }
                            timeout={ 500 }
                            classNames="fade"
                        >
                            <div className={ styles.swatchContainer }
                                data-testid="swatchContainer">
                                <div
                                    className={ styles.swatch }
                                    style={ { backgroundColor: swatch.rgbString } }
                                >
                                    <div className={ styles.swatchUi }>
                                        { swatch.recipe && (
                                            <div className={ styles.recipeInfoButton }>
                                                <button
                                                    style={ {
                                                        color: swatchContrast,
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                    } }
                                                    onClick={ () => setActiveInfoIndex(i === activeInfoIndex ? null : i) }
                                                    aria-label={ `Show recipe for ${ swatch.label }` }
                                                >
                                                    <FaInfo />
                                                </button>
                                            </div>
                                        ) }
                                        <button
                                            className={ styles.removeFromPalette }
                                            onClick={ () => handleRemoveFromPalette(i) }
                                            style={ { color: swatchContrast } }
                                            data-testid={ `remove-button-${ i }` }
                                            aria-label={ `Remove ${ swatch.label }` }
                                        >
                                            <AiOutlineClose />
                                        </button>
                                        { editingColorNameIndex === i ? (
                                            <input
                                                value={ tempColorName }
                                                onChange={ (e) => setTempColorName(e.target.value) }
                                                onBlur={ () => {
                                                    updateColorName(i, tempColorName)
                                                    setEditingColorNameIndex(null)
                                                } }
                                                style={ {
                                                    color: swatchContrast,
                                                    backgroundColor: swatchIsDark ? 'black' : 'white'
                                                } }
                                                autoFocus
                                            />
                                        ) : (
                                            <div
                                                className={ styles.name }
                                                onClick={ () => {
                                                    setEditingColorNameIndex(i)
                                                    setTempColorName(swatch.label)
                                                } }
                                                onKeyDown={ (e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        setEditingColorNameIndex(i)
                                                        setTempColorName(swatch.label)
                                                    }
                                                } }
                                                role="button"
                                                tabIndex={ 0 }
                                                style={ { color: swatchContrast } }
                                                data-testid={ `name-${ i }` }
                                            >
                                                { swatch.label }
                                            </div>
                                        ) }

                                        <button
                                            className={ styles.partsInMix }
                                            onClick={ () => handleSwatchIncrement(i) }
                                            data-testid={ `swatch-parts-${ i }` }
                                            style={ { color: swatchContrast } }
                                            aria-label={ `${ swatch.label }: ${ swatch.partsInMix } parts, click to add` }
                                        >
                                            { swatch.partsInMix }
                                            <div className={ styles.partsPercentage }>
                                                { (swatch.partsInMix > 0.000001) ? (swatch.partsInMix / totalParts * 100).toFixed(0) + '%' : '' }
                                            </div>
                                        </button>

                                        { i === activeInfoIndex && swatch.recipe && (
                                            <div
                                                className={ styles.recipeInfo }
                                                style={ {
                                                    color: swatchContrast,
                                                    backgroundColor: swatch.rgbString
                                                } }
                                                onClick={ () => setActiveInfoIndex(i === activeInfoIndex ? null : i) }
                                                onKeyDown={ (e) => {
                                                    if (e.key === 'Escape' || e.key === 'Enter') setActiveInfoIndex(null)
                                                } }
                                                role="dialog"
                                                aria-label={ `Recipe for ${ swatch.label }` }
                                                tabIndex={ -1 }
                                            >
                                                { swatch.recipe.map((ingredient, index) => (
                                                    <div key={ index }>
                                                        <div
                                                            className={ styles.recipeList }
                                                            style={ {
                                                                backgroundColor: ingredient.rgbString,
                                                                color: tinycolor(ingredient.rgbString).isDark() ? 'white' : 'black'
                                                            } }>
                                                            { ingredient.partsInMix } { ingredient.label }
                                                        </div>
                                                    </div>
                                                )) }
                                            </div>
                                        ) }
                                    </div>
                                </div>

                                <div className={ styles.changePartsQty }>
                                    <button
                                        className={ styles.subtractParts }
                                        onClick={ () => handleSwatchDecrement(i) }
                                        data-testid={ `subtract-button-${ i }` }
                                        aria-label={ `Remove one part of ${ swatch.label }` }
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        </CSSTransition>
                    )
                }) }
            </TransitionGroup>
        </>
    )
}

export default ColorSwatches
