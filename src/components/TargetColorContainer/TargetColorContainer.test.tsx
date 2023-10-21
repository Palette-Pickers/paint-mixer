/* eslint-env jest */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import TargetColorContainer from './TargetColorContainer';

describe('<TargetColorContainer />', () => {
    let mockSetTargetColor, mockSetIsShowingTargetColorPicker;

    beforeEach(() => {
        mockSetTargetColor = jest.fn();
        mockSetIsShowingTargetColorPicker = jest.fn();
    });

    it('should render the target color container when isUsingTargetColor is true', () => {
        const { getByText } = render(
            <TargetColorContainer
                isUsingTargetColor={true}
                targetColor={{ h: 0, s: 0, v: 0, a: 1 }}
                isShowingTargetColorPicker={false}
                targetColorName="White"
                setTargetColor={mockSetTargetColor}
                setIsShowingTargetColorPicker={mockSetIsShowingTargetColorPicker}
            />
        );
        const targetColorText = getByText(/Target Color/i);
        expect(targetColorText).toBeInTheDocument();

    });

    it('should render the ColorPicker when isShowingTargetColorPicker is true', () => {
        const { getByTestId } = render(
            <TargetColorContainer
                isUsingTargetColor={true}
                targetColor={{ h: 0, s: 0, v: 0, a: 1 }}
                isShowingTargetColorPicker={true}
                targetColorName="White"
                setTargetColor={mockSetTargetColor}
                setIsShowingTargetColorPicker={mockSetIsShowingTargetColorPicker}
            />
        );
        const colorPicker = getByTestId('target-color-picker');
        expect(colorPicker).toBeInTheDocument();
    });

    // Add more tests as needed...
});
