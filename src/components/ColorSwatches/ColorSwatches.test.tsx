import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColorSwatches from './ColorSwatches';

interface ColorSwatchesProps {
    palette: any[]; // An array representing the color palette.
    handleSwatchIncrement: (index: number) => void; // Function to handle the increment of a swatch's parts.
    handleSwatchDecrement: (index: number) => void; // Function to handle the decrement of a swatch's parts.
    handleRemoveFromPalette: (index: number) => void; // Function to handle the removal of a swatch from the palette.
    updateColorName: (index: number, name: string) => void; // Function to update the name of a color swatch.
    totalParts: number; // Represents the total parts in the mix.
}

const mockPalette = [
  {
    rgbString: "#FF5733",
    label: "Red",
    partsInMix: 2,
    recipe: [
      { rgbString: "#FF0000", partsInMix: 1, label: "Pure Red" },
      { rgbString: "#FFA500", partsInMix: 1, label: "Orange" }
    ]
  },
  {
    rgbString: "#33FF57",
    label: "Green",
    partsInMix: 1,
    recipe: null
  }
];

// Mock function to handle the increment of a swatch's parts
const mockHandleSwatchIncrement = (index: number) => {
  console.log(`Incrementing parts for swatch at index ${index}`);
};

// Mock function to handle the decrement of a swatch's parts
const mockHandleSwatchDecrement = (index: number) => {
  console.log(`Decrementing parts for swatch at index ${index}`);
};

// Mock function to handle the removal of a swatch from the palette
const mockHandleRemoveFromPalette = (index: number) => {
  console.log(`Removing swatch at index ${index} from palette`);
};

// Mock function to update the name of a color swatch
const mockUpdateColorName = (index: number, name: string) => {
  console.log(`Updating name of swatch at index ${index} to ${name}`);
};

// Mock total parts in the mix
const mockTotalParts = mockPalette.reduce((acc, swatch) => acc + swatch.partsInMix, 0);


describe('<ColorSwatches />', () => {
  it('renders without crashing', () => {
      render(
            <ColorSwatches
                palette={mockPalette}
                handleSwatchIncrement={mockHandleSwatchIncrement}
                handleSwatchDecrement={mockHandleSwatchDecrement}
                handleRemoveFromPalette={mockHandleRemoveFromPalette}
                updateColorName={mockUpdateColorName}
                totalParts={mockTotalParts}
            />
      );
  });

  it('renders the correct number of swatches', () => {
      const {getAllByTestId} = render(
          <ColorSwatches
                palette={mockPalette}
                handleSwatchIncrement={mockHandleSwatchIncrement}
                handleSwatchDecrement={mockHandleSwatchDecrement}
                handleRemoveFromPalette={mockHandleRemoveFromPalette}
                updateColorName={mockUpdateColorName}
                totalParts={mockTotalParts}
          />
      );
    const swatches = getAllByTestId('swatchContainer'); // Assuming you add data-testid="swatch-container" to each swatch container div
        expect(swatches.length).toBe(mockPalette.length);
  });

  // ... other tests ...

});
