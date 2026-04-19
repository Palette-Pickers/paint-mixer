import { useColorName } from './useColorName'

jest.mock('nearest-color', () => ({
    from: () => (hex: string) => {
        if (hex === '#ff0000') return { name: 'Red', value: '#ff0000', rgb: { r: 255, g: 0, b: 0 }, distance: 0 }
        return null
    },
}))

describe('useColorName (getColorName)', () => {
    it('returns the nearest color name for a known hex', async () => {
        const name = await useColorName('ff0000')
        expect(name).toBe('Red')
    })

    it('returns the hex input when no match is found', async () => {
        const name = await useColorName('123456')
        expect(name).toBe('123456')
    })

    it('prepends # before querying the finder', async () => {
        // mock only matches '#ff0000' — verifies # is prepended
        const name = await useColorName('ff0000')
        expect(name).toBe('Red')
    })
})
