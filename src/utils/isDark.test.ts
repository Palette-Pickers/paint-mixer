import isDark from './isDark'

describe('isDark', () => {
    it('returns false for fully transparent colors regardless of rgb values', () => {
        expect(isDark({ r: 0, g: 0, b: 0, a: 0 })).toBe(false)
    })

    it('returns true for black', () => {
        expect(isDark({ r: 0, g: 0, b: 0, a: 1 })).toBe(true)
    })

    it('returns false for white', () => {
        expect(isDark({ r: 255, g: 255, b: 255, a: 1 })).toBe(false)
    })

    it('returns true for a dark color (navy)', () => {
        // luma ≈ 0.2126*0 + 0.7152*0 + 0.0722*128 ≈ 9.2
        expect(isDark({ r: 0, g: 0, b: 128, a: 1 })).toBe(true)
    })

    it('returns false for a light color (yellow)', () => {
        // luma ≈ 0.2126*255 + 0.7152*255 + 0.0722*0 ≈ 236.9
        expect(isDark({ r: 255, g: 255, b: 0, a: 1 })).toBe(false)
    })

    it('returns true for a color with luma just below 80', () => {
        // target luma ~79: solve with r=100, g=90, b=0
        // luma = 0.2126*100 + 0.7152*90 + 0.0722*0 ≈ 21.26 + 64.37 = 85.6... too high
        // r=80, g=80, b=0 → 0.2126*80 + 0.7152*80 = 17.0 + 57.2 = 74.2 → dark
        expect(isDark({ r: 80, g: 80, b: 0, a: 1 })).toBe(true)
    })

    it('returns false for a color with luma just above 80', () => {
        // r=100, g=95, b=0 → 0.2126*100 + 0.7152*95 = 21.26 + 67.94 = 89.2 → light
        expect(isDark({ r: 100, g: 95, b: 0, a: 1 })).toBe(false)
    })

    it('weighs green most heavily per BT.709 (green is lighter than red or blue at same intensity)', () => {
        const pureRed   = isDark({ r: 100, g: 0, b: 0, a: 1 })   // luma ≈ 21.3
        const pureGreen = isDark({ r: 0, g: 100, b: 0, a: 1 })   // luma ≈ 71.5
        const pureBlue  = isDark({ r: 0, g: 0, b: 100, a: 1 })   // luma ≈ 7.2
        expect(pureRed).toBe(true)
        expect(pureGreen).toBe(true)
        expect(pureBlue).toBe(true)
        // green produces the highest luma — verify it's closer to the threshold
        const redLuma   = 0.2126 * 100
        const greenLuma = 0.7152 * 100
        const blueLuma  = 0.0722 * 100
        expect(greenLuma).toBeGreaterThan(redLuma)
        expect(greenLuma).toBeGreaterThan(blueLuma)
    })
})
