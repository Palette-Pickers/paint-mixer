import { useCallback } from 'react'
import { ColorPart, PaletteManager } from '../../types/types'
import { useSwatchAdder } from './useSwatchAdder'

const usePaletteManager = (initialPalette: ColorPart[]): PaletteManager => {
    const { palette, setPalette, addToPalette } = useSwatchAdder(initialPalette)

    const handleSwatchIncrement = useCallback((index: number) => {
        setPalette(prev => prev.map((color, i) =>
            i === index ? { ...color, partsInMix: color.partsInMix + 1 } : color
        ))
    }, [setPalette])

    const handleSwatchDecrement = useCallback((index: number) => {
        setPalette(prev => prev.map((color, i) =>
            i === index && color.partsInMix > 0 ? { ...color, partsInMix: color.partsInMix - 1 } : color
        ))
    }, [setPalette])

    const handleRemoveFromPalette = useCallback((index: number) => {
        setPalette(prev => prev.filter((_, i) => i !== index))
    }, [setPalette])

    const resetPalette = useCallback(() => {
        setPalette(prev => prev.map(color => ({ ...color, partsInMix: 0 })))
    }, [setPalette])

    const updateColorName = useCallback((index: number, newName: string) => {
        setPalette(prev => prev.map((color, i) =>
            i === index ? { ...color, label: newName } : color
        ))
    }, [setPalette])

    return {
        palette,
        handleSwatchIncrement,
        handleSwatchDecrement,
        handleRemoveFromPalette,
        resetPalette,
        addToPalette,
        updateColorName,
    }
}

export default usePaletteManager
