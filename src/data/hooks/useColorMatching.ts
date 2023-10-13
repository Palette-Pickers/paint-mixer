import { useState, useEffect } from 'react';
import tinycolor from "tinycolor2";
import { useDebounce } from 'use-debounce';
import { useColorName } from './useColorName';

export const useColorMatching = (initialColor: string) => {
    const [colorName, setColorName] = useState<string>('');
    const [debouncedColorName] = useDebounce(initialColor, 250);

    useEffect(() => {
        setColorName(''); //reset the color name while we fetch the new one
        const fetchAndSetColorName = async () => {
            const hexColor = tinycolor(initialColor).toHexString();
            const fetchedColorName = await useColorName(hexColor.substring(1)); //remove the # from the hex string
            setColorName(fetchedColorName);
        };
        fetchAndSetColorName();
    }, [debouncedColorName]); //update a maximum of once every 250ms

    return { colorName };
};
