import { useState, useEffect } from 'react';
import tinycolor from "tinycolor2";
import { useDebounce } from 'use-debounce';
import { fetchColorName } from '../hooks/fetchColorName';


export const useColorMatching = (initialColor: string) => {
    const [colorName, setColorName] = useState<string>('');
    const [debouncedColorName] = useDebounce(initialColor, 250);

    useEffect(() => {
        setColorName('');
        const fetchAndSetColorName = async () => {
            const hexColor = tinycolor(debouncedColorName).toHexString();
            const fetchedColorName = await fetchColorName(hexColor.substring(1));
            setColorName(fetchedColorName);
        };
        fetchAndSetColorName();
    }, [debouncedColorName]);

    return { colorName };
};
