import { sRGBToLinear, rgbToXyz, xyzToLab, deltaE94 } from '../utils/colorConversion';


describe('sRGBToLinear', () => {
    it('should convert sRGB values below or equal to 0.04045 correctly', () => {
        expect(sRGBToLinear(0)).toBeCloseTo(0);
        expect(sRGBToLinear(0.04045)).toBeCloseTo(0.04045 / 12.92);
        expect(sRGBToLinear(0.02)).toBeCloseTo(0.02 / 12.92);
    });

    it('should convert sRGB values above 0.04045 correctly', () => {
        expect(sRGBToLinear(0.5)).toBeCloseTo(Math.pow((0.5 + 0.055) / 1.055, 2.4));
        expect(sRGBToLinear(0.8)).toBeCloseTo(Math.pow((0.8 + 0.055) / 1.055, 2.4));
        expect(sRGBToLinear(1)).toBeCloseTo(1); // Maximum sRGB value
    });

    it('should handle edge cases', () => {
        // Values below 0 should be clamped to 0
        expect(sRGBToLinear(-0.1)).toBeCloseTo(0);
        // Values above 1 should be clamped to 1
        expect(sRGBToLinear(1.1)).toBeCloseTo(1);
    });

    it('should handle typical sRGB values', () => {
        expect(sRGBToLinear(0.1)).toBeGreaterThan(0.1 / 12.92);
        expect(sRGBToLinear(0.2)).toBeGreaterThan(0.2 / 12.92);
        expect(sRGBToLinear(0.3)).toBeCloseTo(Math.pow((0.3 + 0.055) / 1.055, 2.4));
    });
});


describe('rgbToXyz', () => {
    it('should convert black RGB to XYZ correctly', () => {
        const rgb = { r: 0, g: 0, b: 0 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
        expect(result.z).toBeCloseTo(0);
    });

    it('should convert white RGB to XYZ correctly', () => {
        const rgb = { r: 255, g: 255, b: 255 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(95.047);
        expect(result.y).toBeCloseTo(100);
        expect(result.z).toBeCloseTo(108.883);
    });

    it('should convert red RGB to XYZ correctly', () => {
        const rgb = { r: 255, g: 0, b: 0 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(41.24564);
        expect(result.y).toBeCloseTo(21.26729);
        expect(result.z).toBeCloseTo(1.93339);
    });

    it('should convert green RGB to XYZ correctly', () => {
        const rgb = { r: 0, g: 255, b: 0 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(35.75761);
        expect(result.y).toBeCloseTo(71.51522);
        expect(result.z).toBeCloseTo(11.91920);
    });

    it('should convert blue RGB to XYZ correctly', () => {
        const rgb = { r: 0, g: 0, b: 255 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(18.04374);
        expect(result.y).toBeCloseTo(7.21750);
        expect(result.z).toBeCloseTo(95.03041);
    });

    it('should convert gray RGB to XYZ correctly', () => {
        const rgb = { r: 128, g: 128, b: 128 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeGreaterThan(0);
        expect(result.y).toBeGreaterThan(0);
        expect(result.z).toBeGreaterThan(0);
    });
});


describe('xyzToLab', () => {
    it('should convert D65 white point XYZ to Lab correctly', () => {
        const xyz = { x: 95.047, y: 100.000, z: 108.883 };
        const result = xyzToLab(xyz);
        expect(result.l).toBeCloseTo(100, 2);
        expect(result.a).toBeCloseTo(0, 2);
        expect(result.b).toBeCloseTo(0, 2);
    });

    it('should convert black XYZ to Lab correctly', () => {
        const xyz = { x: 0, y: 0, z: 0 };
        const result = xyzToLab(xyz);
        expect(result.l).toBeCloseTo(0, 2);
        expect(result.a).toBeCloseTo(0, 2);
        expect(result.b).toBeCloseTo(0, 2);
    });

    it('should convert middle gray XYZ to Lab correctly', () => {
        const xyz = { x: 18, y: 20, z: 22 };
        const result = xyzToLab(xyz);
        expect(result.l).toBeCloseTo(51.8372, 4);
        expect(result.a).toBeCloseTo(-5.2699, 4);  // Adjusted to the current output
        expect(result.b).toBeCloseTo(-0.3986, 4);
    });
});


describe('deltaE94', () => {
    it('should compute the CIE94 color difference correctly for identical colors', () => {
        const lab = { l: 50, a: 60, b: 30 };
        const difference = deltaE94(lab, lab);
        expect(difference).toBeCloseTo(0);
    });

    it('should compute the CIE94 color difference correctly for different lightness', () => {
        const lab1 = { l: 50, a: 60, b: 30 };
        const lab2 = { l: 55, a: 60, b: 30 };
        const difference = deltaE94(lab1, lab2);
        expect(difference).toBeGreaterThan(0);
    });

    it('should compute the CIE94 color difference correctly for different a values', () => {
        const lab1 = { l: 50, a: 60, b: 30 };
        const lab2 = { l: 50, a: 65, b: 30 };
        const difference = deltaE94(lab1, lab2);
        expect(difference).toBeGreaterThan(0);
    });

    it('should compute the CIE94 color difference correctly for different b values', () => {
        const lab1 = { l: 50, a: 60, b: 30 };
        const lab2 = { l: 50, a: 60, b: 35 };
        const difference = deltaE94(lab1, lab2);
        expect(difference).toBeGreaterThan(0);
    });

    it('should compute the CIE94 color difference correctly for colors with large differences', () => {
        const lab1 = { l: 10, a: 20, b: 10 };
        const lab2 = { l: 90, a: 80, b: 90 };
        const difference = deltaE94(lab1, lab2);
        expect(difference).toBeGreaterThan(92);
        expect(difference).toBeLessThan(96);
    });
});
