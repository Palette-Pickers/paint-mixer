import { useState, useEffect } from 'react'

export type PaintColor = {
    medium: string
    brand: string
    name: string
    hex: string
    rgb: string
    hex_available: boolean
}

type State = {
    colors: PaintColor[]
    brands: string[]
    isLoading: boolean
    error: string | null
}

const cache: Record<string, PaintColor[]> = {}

export const usePaintLibrary = (medium: string, brand: string) => {
    const [state, setState] = useState<State>({ colors: [], brands: [], isLoading: true, error: null })

    useEffect(() => {
        if (!medium) return
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const load = async () => {
            try {
                if (!cache[medium]) {
                    const res = await fetch(`/paint-data/${medium}.json`)
                    if (!res.ok) throw new Error(`${res.status}`)
                    const json = await res.json()
                    const data: PaintColor[] = json.paints ?? json
                    cache[medium] = data.filter(c => c.hex_available)
                }
                const available = cache[medium]
                const brands = Array.from(new Set(available.map(c => c.brand))).sort()
                setState({ colors: available, brands, isLoading: false, error: null })
            } catch {
                setState(prev => ({ ...prev, isLoading: false, error: 'Failed to load paint data.' }))
            }
        }

        load()
    }, [medium])

    const filtered = state.colors
        .filter(c => !brand || c.brand === brand)
        .sort((a, b) => {
            const keyA = brand ? a.name : `${a.brand} ${a.name}`
            const keyB = brand ? b.name : `${b.brand} ${b.name}`
            return keyA.localeCompare(keyB)
        })

    return { ...state, filtered }
}
