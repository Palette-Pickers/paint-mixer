import React, {useState} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import tinycolor from "tinycolor2";
import { AiOutlineClose } from 'react-icons/ai';
import { FaInfo } from 'react-icons/fa';

interface ColorSwatchesProps {
    palette: any[];
    handleSwatchIncrement: (index: number) => void;
    handleSwatchDecrement: (index: number) => void;
    handleRemoveFromPalette: (index: number) => void;
    updateColorName: (index: number, name: string) => void;
    totalParts: number;
}

const ColorSwatches: React.FC<ColorSwatchesProps> = ({palette, handleSwatchIncrement, handleSwatchDecrement, handleRemoveFromPalette, updateColorName, totalParts}) => {

    const [editingColorNameIndex, setEditingColorNameIndex] = useState<number | null>(null);
    const [tempColorName, setTempColorName] = useState<string>('');
    const [activeInfoIndex, setActiveInfoIndex] = useState<number | null>(null);

        return (
            <TransitionGroup className="palette">
                {palette.map((swatch, i) => (
                    <CSSTransition
                        key={i}
                        timeout={500}
                        classNames="fade"
                    >
                        <div className="swatch-container">
                            <div
                                className="swatch"
                                style={{backgroundColor: `${swatch.rgbString}`}}
                            >
                                <div className="swatch-ui">
                                    <a
                                        className="remove-from-palette"
                                        onClick={() => handleRemoveFromPalette(i)}
                                        style={{color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black'}}
                                    >
                                        <AiOutlineClose />
                                    </a>
                                    {editingColorNameIndex === i ? (
                                        <input
                                            value={tempColorName}
                                            onChange={(e) => setTempColorName(e.target.value)}
                                            onBlur={() => {
                                                updateColorName(i, tempColorName);
                                                setEditingColorNameIndex(null);
                                            }}
                                            style={{
                                                color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black',
                                                backgroundColor: tinycolor(swatch.rgbString)?.isDark() ? 'black' : 'white'
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className='name'
                                            onClick={() => {
                                                setEditingColorNameIndex(i);
                                                setTempColorName(swatch.label);
                                            }}
                                            style={{color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black'}}
                                        >
                                            {swatch.label}
                                        </div>
                                    )}
                                    {swatch.recipe && (
                                        <div className="recipe-info-button">
                                            <a
                                                style={{color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black'}}
                                                onClick={() => setActiveInfoIndex(i === activeInfoIndex ? null : i)}><FaInfo /></a>
                                        </div>
                                    )}
                                    <div
                                        className="partsInMix"
                                        onClick={() => handleSwatchIncrement(i)}
                                        style={{color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black'}}
                                    >
                                        {swatch.partsInMix}
                                        <div className="parts-percentage">
                                            {(swatch.partsInMix > 0.000001) ? (swatch.partsInMix / totalParts * 100).toFixed(0) + '%' : ''}
                                        </div>
                                    </div>

                                    {i === activeInfoIndex && swatch.recipe && (
                                        <div className="recipe-info"
                                            style={{
                                                color: tinycolor(swatch.rgbString)?.isDark() ? 'white' : 'black',
                                                backgroundColor: swatch.rgbString
                                            }}
                                            onClick={() => setActiveInfoIndex(i === activeInfoIndex ? null : i)}
                                        >
                                            {swatch.recipe.map((ingredient, index) => (
                                                <div key={index}>
                                                    <div
                                                        className="recipe-list"
                                                        style={{
                                                            backgroundColor: ingredient.rgbString,
                                                            color: tinycolor(ingredient.rgbString)?.isDark() ? 'white' : 'black'
                                                        }}>
                                                        {ingredient.partsInMix} {ingredient.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='change-parts-qty'>
                                <button className="subtract-parts" onClick={() => handleSwatchDecrement(i)}>-</button>
                            </div>
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    };

export default ColorSwatches;