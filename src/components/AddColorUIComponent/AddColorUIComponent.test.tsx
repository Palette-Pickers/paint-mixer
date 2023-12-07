import React from 'react'
import { render, screen } from '@testing-library/react'

import AddColorUIComponent from './AddColorUIComponent'

describe('<AddColorUIComponent />', () => {
    const mockProps = {
        showAddColorPicker: true,
        addColor: "#FF5733",
        setShowAddColorPicker: jest.fn(),
        setAddColor: jest.fn(),
        confirmColor: jest.fn()
    }

    it('renders without crashing', () => {
        render(<AddColorUIComponent { ...mockProps } />)
    })

    describe('Visibility of Add Color Button', () => {
        it('hides the add color button when showAddColorPicker is true', () => {
            const { queryByTestId } = render(<AddColorUIComponent { ...mockProps } />)
            expect(queryByTestId('add-circle-outline')).toBeFalsy()
        })

        it('shows the add color button when showAddColorPicker is false', () => {
            const propsWithPickerHidden = { ...mockProps, showAddColorPicker: false }
            render(<AddColorUIComponent { ...propsWithPickerHidden } />)
            const { queryByTestId } = render(<AddColorUIComponent { ...mockProps } />)
            expect(queryByTestId('add-circle-outline')).toBeTruthy()
        })
    })

    describe('Color Picker Visibility', () => {
        it('shows the color picker when showAddColorPicker is true', () => {
            render(<AddColorUIComponent { ...mockProps } />)
            expect(screen.getByTestId('add-color-picker')).toBeTruthy()
        })

        it('hides the color picker when showAddColorPicker is false', () => {
            const propsWithPickerHidden = { ...mockProps, showAddColorPicker: false }
            render(<AddColorUIComponent { ...propsWithPickerHidden } />)
            expect(screen.queryByTestId('add-color-picker')).toBeFalsy()
        })
    })


})
