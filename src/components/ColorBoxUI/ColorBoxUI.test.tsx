import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ColorBoxUI from './ColorBoxUI'

describe('<ColorBoxUI />', () => {
    const mockProps = {
        mixedColor: "#FFFFFF",
        setMixedColor: jest.fn(),
        isUsingTargetColor: true,
        targetColor: {},
        resetPalette: jest.fn(),
        toggleIsUsingTargetColor: jest.fn(),
        isSavable: true,
        addToPalette: jest.fn(),
        hasPartsInMix: jest.fn(),
        palette: []
    }

    it('renders without crashing', () => {
        render(<ColorBoxUI { ...mockProps } />)
    })

    it('calls resetPalette when reset button is clicked', () => {
        const { getByText } = render(<ColorBoxUI { ...mockProps } />)
        fireEvent.click(getByText('Reset'))
        expect(mockProps.resetPalette).toHaveBeenCalled()
    })
    it('calls addToPalette when save button is clicked', () => {
        const { getByText } = render(<ColorBoxUI { ...mockProps } />)
        fireEvent.click(getByText('Save'))
        expect(mockProps.addToPalette).toHaveBeenCalledWith(mockProps.mixedColor, true)
    })

    it('displays "Saved" when isSavable is false', () => {
        const { queryByText } = render(<ColorBoxUI { ...mockProps } isSavable={ false } />)
        expect(queryByText('Saved')).toBeTruthy()
    })

    it('calls toggleIsUsingTargetColor when target button is clicked', () => {
        const { getByText } = render(<ColorBoxUI { ...mockProps } />)
        fireEvent.click(getByText('Target'))
        expect(mockProps.toggleIsUsingTargetColor).toHaveBeenCalled()
    })
})
