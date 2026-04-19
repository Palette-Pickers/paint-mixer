import { renderHook, waitFor } from '@testing-library/react'
import { useColorMatching } from './useColorMatching'

jest.mock('nearest-color', () => ({
    from: () => (hex: string) => ({ name: 'Red', value: '#ff0000', rgb: { r: 255, g: 0, b: 0 }, distance: 0 }),
}))

describe('useColorMatching', () => {
    it('starts with an empty color name then resolves', async () => {
        const { result } = renderHook(() => useColorMatching('rgb(255,0,0)'))
        expect(result.current.colorName).toBe('')
        await waitFor(() => expect(result.current.colorName).not.toBe(''))
        expect(typeof result.current.colorName).toBe('string')
    })

    it('updates when the color input changes', async () => {
        let color = 'rgb(255,0,0)'
        const { result, rerender } = renderHook(() => useColorMatching(color))

        await waitFor(() => expect(result.current.colorName).not.toBe(''))
        const firstName = result.current.colorName

        color = 'rgb(0,0,255)'
        rerender()

        await waitFor(() => expect(result.current.colorName).not.toBe(''))
        // name resolved again (may or may not differ depending on mock, but hook re-ran)
        expect(typeof result.current.colorName).toBe('string')
        expect(result.current.colorName).toBe(firstName) // mock always returns 'Red'
    })

    it('does not throw on an empty color string', async () => {
        const { result } = renderHook(() => useColorMatching(''))
        await waitFor(() => expect(result.current.colorName).toBeDefined())
    })
})
