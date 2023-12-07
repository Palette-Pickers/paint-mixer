import React from 'react'
import { render } from '@testing-library/react'
import MixedColorContainer from './MixedColorContainer'

describe('<MixedColorContainer />', () => {
    it('renders without crashing', () => {
        const mockProps = {
            mixedColor: "#FF5733",
            mixedColorName: "Sunset Orange",
            isUsingTargetColor: true,
            matchPercentage: "95"
        }

        const { getByText } = render(<MixedColorContainer { ...mockProps } />)

        expect(getByText("Sunset Orange")).toBeInTheDocument()
        expect(getByText("95%")).toBeInTheDocument()
    })
})
