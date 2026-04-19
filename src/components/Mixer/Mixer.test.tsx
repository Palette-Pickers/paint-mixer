import React from 'react'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import Mixer from './Mixer'

jest.mock('nearest-color', () => ({
    from: () => () => ({ name: 'Red', value: '#ff0000', rgb: { r: 255, g: 0, b: 0 }, distance: 0 }),
}))

beforeEach(() => {
    localStorage.clear()
})

// drain async color-name updates so act() warnings don't leak between tests
afterEach(async () => {
    await act(async () => {})
})

describe('<Mixer />', () => {
    it('renders without crashing', () => {
        render(<Mixer />)
    })

    it('renders a swatch for each color in the default palette', () => {
        const { getAllByTestId } = render(<Mixer />)
        // defaultPalette has 15 colors
        expect(getAllByTestId('swatchContainer')).toHaveLength(15)
    })

    it('increments parts when a swatch is clicked', async () => {
        const { getByTestId } = render(<Mixer />)
        const partsButton = getByTestId('swatch-parts-0')
        expect(partsButton.textContent).toContain('0')

        await act(async () => {
            fireEvent.click(partsButton)
        })

        expect(getByTestId('swatch-parts-0').textContent).toContain('1')
    })

    it('decrements parts when the subtract button is clicked', async () => {
        const { getByTestId } = render(<Mixer />)

        await act(async () => {
            fireEvent.click(getByTestId('swatch-parts-0'))
            fireEvent.click(getByTestId('swatch-parts-0'))
        })
        expect(getByTestId('swatch-parts-0').textContent).toContain('2')

        await act(async () => {
            fireEvent.click(getByTestId('subtract-button-0'))
        })
        expect(getByTestId('swatch-parts-0').textContent).toContain('1')
    })

    it('does not decrement below zero', async () => {
        const { getByTestId } = render(<Mixer />)

        await act(async () => {
            fireEvent.click(getByTestId('subtract-button-0'))
        })

        expect(getByTestId('swatch-parts-0').textContent).toContain('0')
    })

    it('resets all parts to zero when Reset is clicked', async () => {
        const { getByTestId, getByRole } = render(<Mixer />)

        await act(async () => {
            fireEvent.click(getByTestId('swatch-parts-0'))
            fireEvent.click(getByTestId('swatch-parts-1'))
        })
        expect(getByTestId('swatch-parts-0').textContent).toContain('1')

        await act(async () => {
            fireEvent.click(getByRole('button', { name: /reset/i }))
        })

        expect(getByTestId('swatch-parts-0').textContent).toContain('0')
        expect(getByTestId('swatch-parts-1').textContent).toContain('0')
    })

    it('removes a swatch when its remove button is clicked', async () => {
        const { getAllByTestId, getByTestId } = render(<Mixer />)
        const initial = getAllByTestId('swatchContainer').length

        await act(async () => {
            fireEvent.click(getByTestId('remove-button-0'))
        })

        await waitFor(() => {
            expect(getAllByTestId('swatchContainer').length).toBe(initial - 1)
        })
    })

    it('opens the color picker when the add button is clicked', async () => {
        const { getByTestId, queryByTestId } = render(<Mixer />)
        expect(queryByTestId('add-color-picker')).toBeNull()

        await act(async () => {
            fireEvent.click(getByTestId('add-circle-outline'))
        })

        expect(getByTestId('add-color-picker')).toBeTruthy()
    })

    it('toggles target color mode when Target is clicked', async () => {
        const { getByTestId } = render(<Mixer />)
        expect(getByTestId('target-off-icon')).toBeTruthy()

        await act(async () => {
            fireEvent.click(getByTestId('target-off-icon').closest('button')!)
        })

        expect(getByTestId('target-arrow-icon')).toBeTruthy()
    })

    it('shows Saved initially because transparent maps to white which is in the default palette', () => {
        const { getByText } = render(<Mixer />)
        // mixed color starts transparent → hex #ffffff → matches White in palette → isSavable false
        expect(getByText('Saved')).toBeTruthy()
    })

    it('shows Save after mixing a color not in the palette', async () => {
        const { getByTestId, getByText } = render(<Mixer />)

        // increment two different colors to produce a mix not already in the palette
        await act(async () => {
            fireEvent.click(getByTestId('swatch-parts-0')) // White
            fireEvent.click(getByTestId('swatch-parts-1')) // Cadmium Yellow
        })

        await waitFor(() => {
            expect(getByText('Save')).toBeTruthy()
        })
    })
})
