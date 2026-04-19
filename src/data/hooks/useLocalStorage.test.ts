import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

beforeEach(() => {
    localStorage.clear()
})

describe('useLocalStorage', () => {
    it('returns the initial value when nothing is stored', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
        expect(result.current[0]).toBe('default')
    })

    it('reads an existing value from localStorage', () => {
        localStorage.setItem('test-key', JSON.stringify('stored'))
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
        expect(result.current[0]).toBe('stored')
    })

    it('persists a new value to localStorage when set', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
        act(() => {
            (result.current[1] as (v: string) => void)('updated')
        })
        expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
    })

    it('works with object values', () => {
        const initial = { color: '#ff0000', parts: 1 }
        const { result } = renderHook(() => useLocalStorage('test-obj', initial))
        expect(result.current[0]).toEqual(initial)
    })

    it('falls back to initial value when stored JSON is malformed', () => {
        localStorage.setItem('test-key', 'not-valid-json{{{')
        const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
        expect(result.current[0]).toBe('fallback')
    })
})
