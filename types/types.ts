export interface ColorPart {
    label: string;
    partsInMix: number;
    rgbString: string;
    recipe?: ColorPart[];
}

export interface Rgb {
    r: number;
    g: number;
    b: number;
    a?: number;
}
