import React from 'react';
import styles from './MixGraph.module.scss';
import { ColorPart } from '../../types/types';

interface MixGraphProps {
    palette: ColorPart[];
    totalParts: number;
};

const MixGraph: React.FC<MixGraphProps> = ({ palette, totalParts }) => {
  return (
    <div className={styles.MixGraph}>
        {palette.filter(swatch => swatch.partsInMix > 0).map((swatch, i) => (
            <div
            key={i}
            style={{ //render bar color segment with a width proportional to its use in the mixed color
                backgroundColor: swatch.rgbString,
                width: `${(swatch.partsInMix / totalParts * 100) + '%'}`
            }}
            >
            </div>
        ))}
    </div>
  );
};

export default MixGraph;
