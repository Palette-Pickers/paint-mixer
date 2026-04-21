import { solve } from '../utils/colorSolver'
import { ColorPart } from '../types/types'

addEventListener('message', (event: MessageEvent<{ palette: ColorPart[]; targetRgbString: string; precision: boolean }>) => {
    const { palette, targetRgbString, precision } = event.data
    const result = solve(palette, targetRgbString, precision)
    postMessage(result)
})
