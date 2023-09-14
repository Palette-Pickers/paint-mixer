import React, { useState, useEffect } from 'react';
import mixbox from 'mixbox';
import './Mixer.scss';
import Wheel from "@uiw/react-color-wheel";
import ShadeSlider from '@uiw/react-color-shade-slider'
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';;
import {hsvaToRgba, hsvaToRgbaString} from '@uiw/color-convert';
import tinycolor from "tinycolor2";
import {defaultPalette} from './utils/palettes/defaultPalette';
import {fetchColorName} from './data/hooks/fetchColorName';
import {
    normalizeRgbString,
    rgbToXyz,
    xyzToLab,
    deltaE94
} from './utils/colorConversion';

import {TbTargetArrow, TbTargetOff, TbTarget} from 'react-icons/tb';
import {VscDebugRestart} from 'react-icons/vsc';
import {MdAddCircleOutline} from 'react-icons/md';
import {FaArrowDown} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import {FaInfo} from 'react-icons/fa';


interface ColorPart {
    label: string;
    partsInMix: number;
    rgbString: string;
    recipe?: ColorPart[];
}

interface Rgb {
    r: number;
    g: number;
    b: number;
    a?: number;
}

const Mixer: React.FC = () => {
    const [mixedColor, setMixedColor] = useState<string>('rgba(255,255,255,0)');
    const [palette, setPalette] = useState<ColorPart[]>(defaultPalette);
    const [showNewHsvaPicker, setShowNewHsvaPicker] = useState(false); // State to toggle color picker
    const [newHsva, setNewHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
    const [tempLabel, setTempLabel] = useState<string>('');
    const [targetHsva, setTargetHsva] = useState({h: 214, s: 43, v: 90, a: 1});
    const [useTargetHsva, setUseTargetHsva] = useState<boolean>(false);
    const [showTargetHsvaPicker, setShowTargetHsvaPicker] = useState<boolean>(false); // State to toggle color picker
    const [matchPercentage, setMatchPercentage] = useState<string>('0.00');
    const [canSave, setCanSave] = useState<boolean>(true);
    const [mixedColorName, setMixedColorName] = useState<string>('');
    const [targetColorName, setTargetColorName] = useState<string>('');
    const [activeInfoIndex, setActiveInfoIndex] = useState<number | null>(null);


    const handleSwatchIncrementClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette[index].partsInMix++;  // Increment partsInMix for the clicked swatch
        setPalette(updatedPalette);
    }

    const handleSwatchDecrementClick = (index: number) => {
        const updatedPalette = [...palette];
        if (updatedPalette[index].partsInMix > 0)
            updatedPalette[index].partsInMix--;
        setPalette(updatedPalette);
    }

    const toggleUseTargetColor = () => {
        setUseTargetHsva(!useTargetHsva);
        setShowTargetHsvaPicker(true);
    }

    const handleRemoveFromPaletteClick = (index: number) => {
        const updatedPalette = [...palette];
        updatedPalette.splice(index, 1);  // Remove swatch from palette
        setPalette(updatedPalette);
    }

    const confirmColor = () => {
        if(newHsva) {
            const selectedRgbString = tinycolor(newHsva).toRgbString();
            addToPalette(selectedRgbString, palette);
            setShowNewHsvaPicker(false); // Close the color picker after adding	            setShowColorPicker(false); // Close the color picker after adding
        }
    }

    const hasPartsInMix = (): boolean => {
        return palette.some(color => color.partsInMix > 0);
    };

    const getMixedRgbStringFromPalette = (palette: ColorPart[]): string => {
        let totalParts = palette.reduce((acc, color) => {
            return acc + color.partsInMix;
        }, 0);

        if (totalParts > 0.000001) {
            let latent_mix = [0, 0, 0, 0, 0, 0, 0];

            for (let j = 0; j < palette.length; j++) {
                if (palette[j].partsInMix > 0.000001) {
                    const latent = mixbox.rgbToLatent(palette[j].rgbString);
                    const percentageUsedInMix = palette[j].partsInMix / totalParts;

                    for (let k = 0; k < latent.length; k++) {
                        latent_mix[k] += latent[k] * percentageUsedInMix;
                    }
                }
            }
            const mixed_color = mixbox.latentToRgb(latent_mix);
            return tinycolor(normalizeRgbString(mixed_color)).toRgbString();
        }
        else return tinycolor('rgba(255,255,255,0)').toRgbString();
    }

    const makeColorSwatches = () => {
        if (palette.length) {
            return palette.map((swatch, i) => {
                return (
                    <div className="swatch-container">
                        <div
                            key={i}
                            className="swatch"
                            style={{backgroundColor: `${swatch.rgbString}`}}
                        >
                            <div className="swatch-ui">
                                <a
                                    className="remove-from-palette"
                                    onClick={() => handleRemoveFromPaletteClick(i)}
                                    style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                >
                                    <AiOutlineClose/>
                                </a>
                                {editingLabelIndex === i ? (
                                    <input
                                        value={tempLabel}
                                        onChange={(e) => setTempLabel(e.target.value)}
                                        onBlur={() => {
                                            const updatedPalette = [...palette];
                                            updatedPalette[i].label = tempLabel;
                                            setPalette(updatedPalette);
                                            setEditingLabelIndex(null);
                                        }}
                                        style={{
                                            color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black',
                                            backgroundColor: tinycolor(swatch.rgbString).isDark() ? 'black' : 'white'
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                        <div className='label'
                                            onClick={() => {
                                                setEditingLabelIndex(i);
                                                setTempLabel(swatch.label);
                                            }}
                                            style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                        >

                                                {swatch.label}
                                        </div>
                                )}
                                {swatch.recipe && (
                                    <div className="recipe-info-button">
                                        <a
                                            style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}
                                            onClick={() => setActiveInfoIndex(i === activeInfoIndex ? null : i)}><FaInfo /></a>
                                    </div>
                                )}
                                <div
                                    className="partsInMix"
                                    onClick={() => handleSwatchIncrementClick(i)}
                                    style={{color: tinycolor(swatch.rgbString).isDark() ? 'white' : 'black'}}>
                                    {swatch.partsInMix}
                                </div>
                            </div>

                        </div>
                        <div className='change-parts-qty'>
                            <button className="subtract-parts" onClick={() => handleSwatchDecrementClick(i)}>-</button>
                        </div>


                        {i === activeInfoIndex && swatch.recipe && (
                            <div className="recipe-info">
                                <h3>Recipe:</h3>
                                {swatch.recipe.map((ingredient, index) => (
                                    <div key={index}>
                                        <span style={{backgroundColor: ingredient.rgbString}}></span>
                                        {ingredient.label}: {ingredient.partsInMix} parts
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            )
        })
    }
}







    let paletteSwatches = makeColorSwatches();

    // Helper function to check if a color is already in the palette
    const isColorInPalette = (rgbString: string, palette: ColorPart[]): boolean => {
        const normalizedColor = tinycolor(rgbString).toHexString();
        return palette.some(swatch => tinycolor(swatch.rgbString).toHexString() === normalizedColor);
    }

    const addToPalette = async (rgbString: string, palette: ColorPart[]) => {
        if (!isColorInPalette(rgbString, palette)) { // Only add if the color is not in the palette
            let updatedPalette = [...palette];
            const hexColor = tinycolor(rgbString).toHexString();
            const colorName = await fetchColorName(hexColor.substring(1)); // Remove the '#'
            const recipe = palette.filter(color => color.partsInMix > 0);
            updatedPalette.push({
                "rgbString": rgbString,
                "label": colorName,
                "partsInMix": 0,
                "recipe": recipe //records colors used in a mix so it can be reconstructed
            });
            setPalette(updatedPalette);
        } else {
            console.error("Selected color already in palette", rgbString);
        }
    };

    const getRgbColorMatch = (color1: string, color2: string): number => {
        const color1Lab = xyzToLab(rgbToXyz(tinycolor(color1).toRgb()));
        const color2Lab = xyzToLab(rgbToXyz(tinycolor(color2).toRgb()));
        return (100-deltaE94(color1Lab, color2Lab)); //convert % difference to % match
    }

    const resetMix = () => {
        const resetPalette = palette.map(color => ({
            ...color,
            partsInMix: 0
        }));
        setPalette(resetPalette);
    }

    useEffect(() => {
        setMixedColor(getMixedRgbStringFromPalette(palette));
    }, [palette]);

    useEffect(() => {
        setMatchPercentage(getRgbColorMatch((mixedColor), (hsvaToRgbaString(targetHsva))).toFixed(2));
    }, [mixedColor, targetHsva]);

    useEffect(() => {
        setCanSave(!isColorInPalette(mixedColor, palette));
    }, [mixedColor, palette]);

    useEffect(() => {
        const fetchAndSetMixedColorName = async () => {
            setMixedColorName(''); // Set to empty string immediately
            const hexColor = tinycolor(mixedColor).toHexString();
            const fetchedColorName = await fetchColorName(hexColor.substring(1));
            setMixedColorName(fetchedColorName);
        };

        fetchAndSetMixedColorName();
    }, [mixedColor]);

    useEffect(() => {
        const fetchAndSetTargetColorName = async () => {
            setTargetColorName(''); // Set to empty string immediately
            const hexColor = tinycolor(hsvaToRgbaString(targetHsva)).toHexString();
            const fetchedColorName = await fetchColorName(hexColor.substring(1));
            setTargetColorName(fetchedColorName);
        };

        fetchAndSetTargetColorName();
    }, [targetHsva]);


    return (
        <>
            <main className='Mixer'>
                <div className='color-box'>
                    <section className='mixed-color-container'
                        style={{
                            backgroundColor: mixedColor,
                            color: tinycolor(mixedColor).isDark() ? 'white' : 'black'
                        }}
                    >
                        <div
                            className='mixed-color-values'>
                            <label>Mixed Color</label>
                            {tinycolor(mixedColor).toHexString()}
                            <div>{mixedColorName}</div>

                        {useTargetHsva && (
                                <p className='match-pct'
                                    style={{ color: tinycolor(mixedColor).isDark() ? 'white' : 'black'}}
                                >
                                    <label>Target Match</label>
                                    <div>{matchPercentage}%</div>
                            </p>
                        )}
                    </div>




                    </section>
                    {useTargetHsva && (
                    <section className='target-color-container'
                        style={{
                            background: hsvaToRgbaString(targetHsva),
                            color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                            display: (useTargetHsva ? 'block' : 'none'),
                        }}
                        >





                    {showTargetHsvaPicker && (
                            <>
                                <div className='target-color-box'
                                style={{
                                    background: hsvaToRgbaString(targetHsva),
                                    color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                                }}
                                >
                                <button
                                    className='close-button'
                                    onClick={() => setShowTargetHsvaPicker(false)}
                                    style={{
                                        color: tinycolor(hsvaToRgba(targetHsva)).isDark() ? 'white' : 'black',
                                        transition: 'color 0.1s ease-in-out'
                                    }}
                                >
                                    <AiOutlineClose/>
                                </button>

                                    <Wheel
                                        color={targetHsva}
                                        onChange={(color) => setTargetHsva({...targetHsva, ...color.hsva})}
                                    />
                                    <div className='shade-slider'>
                                        <ShadeSlider
                                            hsva={targetHsva}
                                            onChange={(newShade) => {
                                                setTargetHsva({...targetHsva, ...newShade});
                                            }}
                                        />
                                    </div>
                                    <EditableInputRGBA
                                        hsva={targetHsva}
                                        placement="top"
                                        onChange={(color) => {
                                            setTargetHsva({...targetHsva, ...color.hsva});
                                        }}
                                    />
                                </div>
                        </>
                            )}
                            <div className='target-color-values'>
                                <label>Target Color</label>
                                {tinycolor(targetHsva).toHexString()}
                                <div>{targetColorName}</div>
                            </div>
                        </section>
                        )}
                    <div className='color-box-ui'>

                        <div>
                                <button
                                    className='reset-mix'
                                    onClick={resetMix}
                                    id='reset-mix'
                                    style={{
                                        color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                        opacity: hasPartsInMix() ? 1 : 0 // Chan,ge the opacity to indicate it's disabled
                                    }}
                                >
                                    <VscDebugRestart />
                                    <label className='button-reset-mix'>Reset</label>
                                </button>
                            </div>


                        <div className='color-box-label'>
                            <button
                                className="add-to-palette"
                                onClick={() => addToPalette(mixedColor, palette)}
                                disabled={!canSave} // Disable the button based on canSave state
                                style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                    opacity: canSave ? 1 : 0.5 // Optionally, you can change the opacity to indicate it's disabled
                                }}
                            >
                                <FaArrowDown style={{
                                    color: tinycolor(mixedColor).isDark() ? 'white' : 'black',
                                    opacity: canSave ? 1 : 0 // Change the opacity to indicate it's disabled
                                }}
                                />
                                <label className='button-save'>
                                    {canSave ? 'Save' : 'Saved'}
                                </label>
                            </button>
                        </div>

                        <button
                            className="toggle-target-color"
                            onClick={toggleUseTargetColor}
                            style={{
                                color: useTargetHsva?
                                    tinycolor(hsvaToRgba(targetHsva)).isDark()? 'white' : 'black' :
                                    tinycolor(mixedColor).isDark()? 'white' : 'black'
                            }}
                        >
                            {(useTargetHsva ? <TbTargetArrow /> : <TbTargetOff />)}
                            <label className='button-target-color'>Target</label>
                        </button>
                    </div>
                    <div className='transparency-box'></div>
                </div>

                <section className='swatches'>
                    {paletteSwatches}

                    <div className="add-color-ui">
                        <button
                            style={{
                                visibility: (showNewHsvaPicker) ? 'hidden' : 'visible',
                                display: (showNewHsvaPicker) ? 'none' : 'block',
                                cursor: (showNewHsvaPicker) ? 'default' : 'pointer'
                            }}
                            onClick={() => setShowNewHsvaPicker(!showNewHsvaPicker)}
                        >
                            <MdAddCircleOutline/>
                        </button>

                        {showNewHsvaPicker && (
                            <>
                                <div
                                    className='popover-box'
                                    style={{background: hsvaToRgbaString(newHsva)}}
                                >
                                        <Wheel
                                            color={newHsva}
                                            onChange={(color) => setNewHsva({...newHsva, ...color.hsva})}
                                        />
                                        <div className='shade-slider'>
                                            <ShadeSlider
                                                hsva={newHsva}
                                                onChange={(newShade) => {
                                                    setNewHsva({...newHsva, ...newShade});
                                                }}
                                            />
                                        </div>
                                        <EditableInputRGBA
                                            hsva={newHsva}
                                            placement="top"
                                            onChange={(color) => {
                                                setNewHsva({...newHsva, ...color.hsva});
                                            }}
                                        />
                                    <button onClick={confirmColor}>
                                        Add
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Mixer;
