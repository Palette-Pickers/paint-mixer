declare module 'nearest-color' {
    interface ColorMatch {
        name: string
        value: string
        rgb: { r: number; g: number; b: number }
        distance: number
    }

    interface NearestColorFn {
        (hex: string): ColorMatch | null
    }

    function from(colors: Record<string, string>): NearestColorFn
    export { from }
}
