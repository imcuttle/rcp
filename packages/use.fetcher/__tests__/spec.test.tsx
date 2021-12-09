/**
 * @file spec
 * @author 余聪
 * @description
 */
import useFetcher, { useReplacers, ReplacerProvider } from '../index'
import { renderHook, act } from '@testing-library/react-hooks'
import React = require('react')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchData = jest.fn(async () => {
  await delay(100)
  return {
    age: 12,
    name: 'imcuttle'
  }
})

describe('useFetcher', function () {
  it('should spec ', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
    expect(result.current?.[0]).toBeUndefined()

    await waitForNextUpdate()
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'imcuttle'
    })
  })

  it('should spec with key', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData, { key: 'fetch' }))
    expect(result.current?.[0]).toBeUndefined()

    await waitForNextUpdate()
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'imcuttle'
    })
  })

  it('replacer', async () => {
    const mockFetchData = jest.fn(async () => {
      await delay(100)
      return {
        age: 12,
        name: 'mock'
      }
    })

    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData), {
      wrapper: ({ children }) => (
        <ReplacerProvider
          replacers={[
            {
              with: fetchData,
              as: mockFetchData
            }
          ]}
        >
          {children}
        </ReplacerProvider>
      )
    })
    await waitForNextUpdate()
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'mock'
    })
  })

  it('replacer with key', async () => {
    const mockFetchData = jest.fn(async () => {
      await delay(100)
      return {
        age: 12,
        name: 'mock'
      }
    })

    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData, { key: 'fetch' }), {
      wrapper: ({ children }) => (
        <ReplacerProvider
          replacers={[
            {
              with: 'fetch',
              as: mockFetchData
            }
          ]}
        >
          {children}
        </ReplacerProvider>
      )
    })
    await waitForNextUpdate()
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'mock'
    })
  })

  it('spec refetch/setValue/loading', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData, { eq: 'deep' }))
    expect(result.current?.[2]).toMatchObject({
      loading: true,
      initialized: false
    })
    await waitForNextUpdate()

    expect(result.current?.[2]).toMatchObject({
      loading: false,
      initialized: true
    })
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'imcuttle'
    })

    act(() => {
      result.current?.[1]((v) => ({ ...v, name: 'mock' }))
    })

    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'mock'
    })

    act(() => {
      result.current?.[2].fetch()
    })

    await waitForNextUpdate()
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'imcuttle'
    })
  })
  it('spec catchError:true', async () => {
    const fetchThrowError = async () => {
      await delay(100)
      throw new Error('error')
    }

    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchThrowError, { catchError: true }))
    await waitForNextUpdate()
    expect(result.current?.[2].error).toMatchInlineSnapshot(`[Error: error]`)
  })

  it.skip('Suspense', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData, { suspense: true }))

    console.log(result.current)

    expect(result.current?.[2]).toMatchObject({
      loading: false,
      initialized: true
    })
    expect(result.current?.[0]).toEqual({
      age: 12,
      name: 'imcuttle'
    })
  })
})
