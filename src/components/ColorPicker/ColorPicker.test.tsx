import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ColorPicker from './ColorPicker'

describe('<ColorPicker />', () => {
    const mockColor = { h: 150, s: 50, v: 50, a: 1 }
    const mockOnChange = jest.fn()
    const mockOnClose = jest.fn()
    const mockOnConfirm = jest.fn()

    it('renders without crashing', () => {
        render(<ColorPicker color={ mockColor } onChange={ mockOnChange } onClose={ mockOnClose } onConfirm={ mockOnConfirm } />)
    })

    it('calls onChange when color is changed', () => {
        const { container } = render(<ColorPicker color={ mockColor } onChange={ mockOnChange } onClose={ mockOnClose } onConfirm={ mockOnConfirm } />)
        const colorWheel = container.querySelector('.w-color-wheel')
        if (colorWheel) {
            fireEvent.mouseDown(colorWheel)
            expect(mockOnChange).toHaveBeenCalled()
        } else {
            throw new Error('Color wheel element not found')
        }
    })

    it('calls onClose when close button is clicked', () => {
        const { getByTestId } = render(<ColorPicker color={ mockColor } onChange={ mockOnChange } onClose={ mockOnClose } onConfirm={ mockOnConfirm } />)
        const closeButton = getByTestId('swatch-remove')
        fireEvent.click(closeButton)
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onConfirm when OK button is clicked', () => {
        const { getByRole } = render(<ColorPicker color={ mockColor } onChange={ mockOnChange } onClose={ mockOnClose } onConfirm={ mockOnConfirm } />)
        const confirmButton = getByRole('button', { name: /ok/i })
        fireEvent.click(confirmButton)
        expect(mockOnConfirm).toHaveBeenCalled()
    })
})
