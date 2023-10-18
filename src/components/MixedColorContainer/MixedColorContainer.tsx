import React from 'react';
import styles from './MixedColorContainer.module.scss';
import {normalizeRgbString} from '../../utils/colorConversion';
import tinycolor from "tinycolor2";

interface MixedColorContainerProps {
    mixedColor: string;
    mixedColorName: string;
    isUsingTargetColor: boolean;
    matchPercentage: string;
}

const MixedColorContainer: React.FC<MixedColorContainerProps> = ({ mixedColor, mixedColorName, isUsingTargetColor, matchPercentage }) => {
    return (
        <section className={styles.MixedColorContainer}
            style={{
                backgroundColor: mixedColor,
                color: tinycolor(mixedColor)?.isDark() ? 'white' : 'black'
            }}
        >
            <div className={styles.mixedColorValues}>
                <div>
                    <label htmlFor="mixed-color">
                        Mixed Color
                    </label>
                    <div id="mixed-color">
                        <p>
                            {(tinycolor(normalizeRgbString(mixedColor)).toHexString())}
                        </p>
                        <p>
                            {mixedColorName}
                        </p>
                    </div>
                </div>

                {isUsingTargetColor && (
                    <div className={styles.matchPct}
                        style={{color: tinycolor(mixedColor)?.isDark() ? 'white' : 'black'}}
                    >
                        <label>Target Match</label>
                        <div>{matchPercentage}%</div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MixedColorContainer;
