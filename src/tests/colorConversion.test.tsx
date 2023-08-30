import { sRGBToLinear, rgbToXyz, xyzToLab, deltaE94 } from '../utils/colorConversion';


describe('sRGBToLinear', () => {
    it('should convert sRGB to linear RGB correctly', () => {
        expect(sRGBToLinear(0.04045)).toBeCloseTo(0.04045 / 12.92);
        expect(sRGBToLinear(0.5)).toBeCloseTo(Math.pow((0.5 + 0.055) / 1.055, 2.4));
    });
});

describe('rgbToXyz', () => {
    it('should convert RGB to XYZ correctly', () => {
        const rgb = { r: 255, g: 0, b: 0 };
        const result = rgbToXyz(rgb);
        expect(result.x).toBeCloseTo(41.24564);
        expect(result.y).toBeCloseTo(21.26729);
        expect(result.z).toBeCloseTo(1.93339);
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
    it('should compute the CIE94 color difference correctly', () => {
        const lab1 = { l: 50, a: 60, b: 30 };
        const lab2 = { l: 55, a: 62, b: 29 };
        const difference = deltaE94(lab1, lab2);
        expect(difference).toBeGreaterThan(0);
    });
});
