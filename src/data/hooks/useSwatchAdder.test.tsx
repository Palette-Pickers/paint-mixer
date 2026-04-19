import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { useSwatchAdder } from './useSwatchAdder'
import { ColorPart } from '../../types/types'

jest.mock('nearest-color', () => ({
    from: () => () => ({ name: 'Red', value: '#ff0000', rgb: { r: 255, g: 0, b: 0 }, distance: 0 }),
}))

const red: ColorPart = { rgbString: 'rgb(255, 0, 0)', label: 'Red', partsInMix: 0 }
const blue: ColorPart = { rgbString: 'rgb(0, 0, 255)', label: 'Blue', partsInMix: 0 }

interface TestProps {
    initialPalette: ColorPart[]
    addRgb?: string
    includeRecipe?: boolean
}

const TestComponent: React.FC<TestProps> = ({ initialPalette, addRgb = 'rgb(0, 128, 0)', includeRecipe = false }) => {
    const { palette, addToPalette } = useSwatchAdder(initialPalette)
    return (
        <div>
            <div data-testid="palette">{ JSON.stringify(palette) }</div>
            <button data-testid="add" onClick={ () => addToPalette(addRgb, includeRecipe) }>Add</button>
        </div>
    )
}

describe('useSwatchAdder', () => {
    it('initializes with the provided palette', () => {
        const { getByTestId } = render(<TestComponent initialPalette={ [red] } />)
        const palette = JSON.parse(getByTestId('palette').textContent || '')
        expect(palette).toHaveLength(1)
        expect(palette[0].label).toBe('Red')
    })

    it('adds a new color to the palette', async () => {
        const { getByTestId } = render(<TestComponent initialPalette={ [red] } />)

        await act(async () => {
            fireEvent.click(getByTestId('add'))
        })

        const palette = JSON.parse(getByTestId('palette').textContent || '')
        expect(palette).toHaveLength(2)
    })

    it('ignores duplicate colors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const { getByTestId } = render(<TestComponent initialPalette={ [red] } addRgb="rgb(255, 0, 0)" />)

        await act(async () => {
            fireEvent.click(getByTestId('add'))
        })
        consoleSpy.mockRestore()

        const palette = JSON.parse(getByTestId('palette').textContent || '')
        expect(palette).toHaveLength(1)
    })

    it('new colors start with partsInMix of 0', async () => {
        const { getByTestId } = render(<TestComponent initialPalette={ [] } />)

        await act(async () => {
            fireEvent.click(getByTestId('add'))
        })

        const palette = JSON.parse(getByTestId('palette').textContent || '')
        expect(palette[0].partsInMix).toBe(0)
    })

    it('attaches a recipe when includeRecipe is true', async () => {
        const withParts = { ...red, partsInMix: 2 }
        const { getByTestId } = render(
            <TestComponent initialPalette={ [withParts, blue] } addRgb="rgb(0, 128, 0)" includeRecipe={ true } />
        )

        await act(async () => {
            fireEvent.click(getByTestId('add'))
        })

        const palette = JSON.parse(getByTestId('palette').textContent || '')
        const added = palette[2]
        expect(added.recipe).toBeDefined()
        expect(added.recipe).toHaveLength(1) // only withParts has partsInMix > 0
        expect(added.recipe[0].label).toBe('Red')
    })

    it('does not attach a recipe when includeRecipe is false', async () => {
        const withParts = { ...red, partsInMix: 2 }
        const { getByTestId } = render(
            <TestComponent initialPalette={ [withParts] } addRgb="rgb(0, 128, 0)" includeRecipe={ false } />
        )

        await act(async () => {
            fireEvent.click(getByTestId('add'))
        })

        const palette = JSON.parse(getByTestId('palette').textContent || '')
        expect(palette[1].recipe).toBeUndefined()
    })
})
