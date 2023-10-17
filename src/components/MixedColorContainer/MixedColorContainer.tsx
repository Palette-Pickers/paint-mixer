// MixedColorContainer.tsx

import React from 'react';

interface MixedColorContainerProps {
    mixedColor: string;
}

const MixedColorContainer: React.FC<MixedColorContainerProps> = ({ mixedColor }) => {
    return (
        <div className="mixed-color-container">
            <div className="color-display" style={{ backgroundColor: mixedColor }}>
                {/* Display the mixed color */}
            </div>
            <p>{mixedColor}</p> {/* Display the mixed color value */}
        </div>
    );
}

export default MixedColorContainer;
