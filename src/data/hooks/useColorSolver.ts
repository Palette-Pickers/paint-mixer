import { useState, useEffect, useRef } from 'react'
import { ColorPart } from '../../types/types'
import { SolverResult } from '../../utils/colorSolver'

export const useColorSolver = (
    palette: ColorPart[],
    targetRgbString: string,
    enabled: boolean,
    precision: boolean
) => {
    const [result, setResult] = useState<SolverResult | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const workerRef = useRef<Worker | null>(null)

    useEffect(() => {
        if (!enabled || palette.length === 0) {
            setResult(null)
            return
        }

        workerRef.current?.terminate()

        const worker = new Worker(
            new URL('../../workers/colorSolver.worker.ts', import.meta.url)
        )
        workerRef.current = worker
        setIsRunning(true)

        worker.onmessage = (event: MessageEvent<SolverResult>) => {
            setResult(event.data)
            setIsRunning(false)
        }

        worker.onerror = () => {
            setIsRunning(false)
        }

        worker.postMessage({ palette, targetRgbString, precision })

        return () => {
            worker.terminate()
        }
    }, [palette, targetRgbString, enabled, precision])

    return { result, isRunning }
}
