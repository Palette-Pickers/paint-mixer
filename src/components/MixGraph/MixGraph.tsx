import React from 'react';

type MixGraphProps = {
    palette: any[];
    totalParts: number;
};

const MixGraph: React.FC<MixGraphProps> = ({ palette, totalParts }) => {
  return (
    <div style={{ display: 'flex', height: '20px', width: '100%', border: '1px solid black'}}>
        {palette.map((swatch, i) => (
            <div
            key={i}
            style={{
                backgroundColor: swatch.rgbString,
                width: `${(swatch.partsInMix / totalParts * 100) + '%'}`
                //render swatch's background color with a width proportional to its use in the mixed color.
            }}
            >
            </div>
        ))}
    </div>
  );
};

export default MixGraph;
