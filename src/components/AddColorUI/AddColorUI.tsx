// AddColorUI.tsx

import React, { useState } from 'react';

interface AddColorUIProps {
    onAddColor: (color: string) => void; // Callback to handle adding a new color to the palette
}

const AddColorUI: React.FC<AddColorUIProps> = ({ onAddColor }) => {
    const [colorInput, setColorInput] = useState<string>(''); // State to hold the color input value

    const handleAddColor = () => {
        if (colorInput) {
            onAddColor(colorInput);
            setColorInput(''); // Reset the input after adding
        }
    };

    return (
        <div className="add-color-ui">
            <input
                type="text"
                placeholder="Enter color (e.g., #FF5733)"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
            />
            <button onClick={handleAddColor}>Add Color</button>
        </div>
    );
}

export default AddColorUI;
