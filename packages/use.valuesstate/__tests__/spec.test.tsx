import useValuesState from '..'
import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'

describe('useValuesState', () => {
  it('add', () => {
    const { result } = renderHook(() => useValuesState([1, 2, 3]))
    act(() => result.current.add(1))
    expect(result.current.values).toMatchInlineSnapshot(`
Array [
  1,
  2,
  3,
]
`)

    act(() => result.current.add(4))
    expect(result.current.values).toMatchInlineSnapshot(`
Array [
  1,
  2,
  3,
  4,
]
`)
  })

  it('remove', () => {
    const { result } = renderHook(() => useValuesState([1, 2, 3]))
    act(() => result.current.remove(1))
    expect(result.current.values).toMatchInlineSnapshot(`
Array [
  2,
  3,
]
`)
  })

  it('has', () => {
    const { result } = renderHook(() => useValuesState([1, 2, 3]))
    expect(result.current.has(1)).toMatchInlineSnapshot(`true`)
  })

  it('values', () => {
    const { result } = renderHook(() => useValuesState([1, 2, 3]))
    expect(result.current.values).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `)
  })

  it('setValues', () => {
    const { result } = renderHook(() => useValuesState([1, 2, 3]))
    act(() => result.current.setValues([]))
    expect(result.current.values).toMatchInlineSnapshot(`Array []`)
  })
})
