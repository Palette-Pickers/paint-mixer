import mixbox from 'mixbox'
import tinycolor from 'tinycolor2'
import { normalizeRgbString, rgbToXyz, xyzToLab, deltaE94 } from './colorConversion'
import { ColorPart } from '../types/types'

export type SolverResult = {
    mix: Array<{ index: number; parts: number }>
    deltaE: number
    matchPercentage: number
}

const TOTAL_PARTS_STANDARD = 12
const TOTAL_PARTS_PRECISION = 24

function blendSubset(colors: ColorPart[], weights: number[]): string {
    const total = weights.reduce((a, b) => a + b, 0)
    const latentMix: number[] = [0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < colors.length; i++) {
        const latent = mixbox.rgbToLatent(colors[i].rgbString)
        const fraction = weights[i] / total
        for (let k = 0; k < 7; k++) latentMix[k] += latent[k] * fraction
    }
    return normalizeRgbString(mixbox.latentToRgb(latentMix))
}

function computeDeltaE(rgbString: string, target: { r: number; g: number; b: number }): number {
    const { r, g, b } = tinycolor(rgbString).toRgb()
    const lab1 = xyzToLab(rgbToXyz({ r, g, b }))
    const lab2 = xyzToLab(rgbToXyz(target))
    return deltaE94(lab1, lab2)
}

function* indexCombinations(start: number, n: number, k: number): Generator<number[]> {
    if (k === 0) { yield []; return }
    for (let i = start; i <= n - k; i++) {
        for (const rest of indexCombinations(i + 1, n, k - 1)) {
            yield [i, ...rest]
        }
    }
}

function* integerCompositions(total: number, parts: number): Generator<number[]> {
    if (parts === 1) { yield [total]; return }
    for (let first = 1; first <= total - (parts - 1); first++) {
        for (const rest of integerCompositions(total - first, parts - 1)) {
            yield [first, ...rest]
        }
    }
}

export function solve(palette: ColorPart[], targetRgbString: string, precision = false): SolverResult {
    const TOTAL_PARTS = precision ? TOTAL_PARTS_PRECISION : TOTAL_PARTS_STANDARD
    const { r, g, b } = tinycolor(targetRgbString).toRgb()
    const targetRgb = { r, g, b }
    const n = palette.length

    let bestDeltaE = Infinity
    let bestMix: Array<{ index: number; parts: number }> = []

    const maxSubsetSize = Math.min(3, n)
    for (let subsetSize = 1; subsetSize <= maxSubsetSize; subsetSize++) {
        for (const indices of indexCombinations(0, n, subsetSize)) {
            const colors = indices.map(i => palette[i])
            for (const weights of integerCompositions(TOTAL_PARTS, subsetSize)) {
                const mixed = blendSubset(colors, weights)
                const de = computeDeltaE(mixed, targetRgb)
                if (de < bestDeltaE) {
                    bestDeltaE = de
                    bestMix = indices.map((idx, i) => ({ index: idx, parts: weights[i] }))
                }
            }
        }
    }

    return {
        mix: bestMix,
        deltaE: bestDeltaE,
        matchPercentage: parseFloat(Math.max(0, 100 - bestDeltaE).toFixed(2)),
    }
}
