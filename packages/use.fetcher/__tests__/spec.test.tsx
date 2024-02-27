/**
 * @file spec
 * @author 余聪
 * @description
 */
import useFetcher, { preload, ReplacerProvider, addGlobalPlugins } from '../index'
import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'
import { decorateEntity } from '../decrease-render-times'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const delayRaf = () => new Promise((resolve) => requestAnimationFrame(resolve))

const fetchData = jest.fn(async () => {
  await delayRaf()
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

  describe('plugins', function () {
    it('global', async () => {
      const unsuspenseEntityTransformHook = jest.fn((ent) => {
        return {
          ...ent,
          res: ent.res
            ? {
                ...ent.res,
                extra_2: 'test'
              }
            : ent.res
        }
      })
      const preFetchHooks = jest.fn((params) => {
        return {
          ...params,
          fetcher: async () => ({
            ...(await params.fetcher()),
            extra: 'test'
          })
        }
      })
      const dispose = addGlobalPlugins({
        preFetchHooks: [preFetchHooks],
        unsuspenseEntityTransformHooks: [unsuspenseEntityTransformHook, () => undefined]
      })

      const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
      expect(result.current[2]).toMatchObject({
        res: undefined,
        initialized: false,
        loading: true
      })
      await waitForNextUpdate()
      expect(result.current[2]).toMatchObject({
        res: {
          age: 12,
          extra: 'test',
          extra_2: 'test',
          name: 'imcuttle'
        },
        initialized: true,
        loading: false
      })

      // after
      await (async function () {
        dispose()
        const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
        await waitForNextUpdate()
        expect(result.current[2]).toMatchObject({
          res: {
            age: 12,
            name: 'imcuttle'
          },
          initialized: true,
          loading: false
        })
      })()
    })
  })

  describe('sync-deps', function () {
    const mapSeriailzeData = (d) => {
      return Object.keys(d).reduce((acc, k) => {
        if (typeof d[k] !== 'function') {
          acc[k] = d[k]
        }
        return acc
      }, {})
    }

    it('core', async () => {
      const init = {
        error: new Error(''),
        loading: false
      }
      const rlt = decorateEntity(init as any)

      expect(Array.from(rlt._syncUsedDepSet.values())).toEqual([])

      rlt.entity.error
      expect(Array.from(rlt._syncUsedDepSet.values())).toEqual(['error'])

      rlt.entity.loading
      expect(Array.from(rlt._syncUsedDepSet.values())).toEqual(['error', 'loading'])

      expect(rlt.entity).toEqual(init)
    })

    it('core async', async () => {
      const init = {
        error: new Error(''),
        loading: false
      }
      const rlt = decorateEntity(init as any)

      rlt.entity.error
      expect(Array.from(rlt._syncUsedDepSet.values())).toEqual(['error'])
      await delayRaf()

      rlt.entity.loading
      expect(Array.from(rlt._syncUsedDepSet.values())).toEqual(['error'])
    })
    it('render times: only data', async () => {
      const hook = jest.fn(() => {
        const rlt = useFetcher(fetchData)
        return rlt[2]
      })
      const { result, waitForNextUpdate } = renderHook(hook)
      await waitForNextUpdate()

      act(() => {
        result.current.fetch()
      })
      await waitForNextUpdate()
      expect(result.all.length).toBe(3)
      expect(result.all.map(mapSeriailzeData)).toMatchInlineSnapshot(`
Array [
  Object {
    "error": null,
    "initialized": false,
    "loading": true,
    "res": undefined,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": Object {
      "age": 12,
      "name": "imcuttle",
    },
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": Object {
      "age": 12,
      "name": "imcuttle",
    },
  },
]
`)
    })
    it('render times: only data / same res', async () => {
      const hook = jest.fn(() => {
        const rlt = useFetcher(async () => {
          await delay(0)
          return 1
        })
        return rlt[2]
      })
      const { result, waitForNextUpdate } = renderHook(hook)
      await waitForNextUpdate()

      act(() => {
        result.current.fetch()
      })

      expect(result.all.length).toBe(2)
      expect(result.all.map(mapSeriailzeData)).toMatchInlineSnapshot(`
Array [
  Object {
    "error": null,
    "initialized": false,
    "loading": true,
    "res": undefined,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": 1,
  },
]
`)
    })

    it('render times: data/loading', async () => {
      const hook = jest.fn(() => {
        const rlt = useFetcher(fetchData)
        rlt[2].loading
        return rlt[2]
      })
      const { result, waitForNextUpdate } = renderHook(hook)
      await waitForNextUpdate()
      act(() => {
        result.current.fetch()
      })

      await waitForNextUpdate()
      expect(result.all.length).toBe(4)
      expect(result.all.map(mapSeriailzeData)).toMatchInlineSnapshot(`
Array [
  Object {
    "error": null,
    "initialized": false,
    "loading": true,
    "res": undefined,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": Object {
      "age": 12,
      "name": "imcuttle",
    },
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": true,
    "res": Object {
      "age": 12,
      "name": "imcuttle",
    },
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": Object {
      "age": 12,
      "name": "imcuttle",
    },
  },
]
`)
    })
    it('render times: data/loading / same res', async () => {
      const hook = jest.fn(() => {
        const rlt = useFetcher(() => 1)
        rlt[2].loading
        return rlt[2]
      })
      const { result, waitForNextUpdate } = renderHook(hook)
      await waitForNextUpdate()
      act(() => {
        result.current.fetch()
      })

      await waitForNextUpdate()
      expect(result.all.length).toBe(4)
      expect(result.all.map(mapSeriailzeData)).toMatchInlineSnapshot(`
Array [
  Object {
    "error": null,
    "initialized": false,
    "loading": true,
    "res": undefined,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": 1,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": true,
    "res": 1,
  },
  Object {
    "error": null,
    "initialized": true,
    "loading": false,
    "res": 1,
  },
]
`)
    })

    //     it.skip('render times: data/loading/error', async () => {
    //       const hook = jest.fn(() => {
    //         const rlt = useFetcher(async () => {
    //           await delayRaf()
    //           throw new Error('test')
    //         })
    //         rlt[2].loading
    //         rlt[2].error
    //         return rlt[2]
    //       })
    //       const { result, waitForNextUpdate } = renderHook(hook)
    //       expect(result.all.length).toBe(1)
    //       await waitForNextUpdate()
    //       expect(result.all.length).toBe(2)
    //
    //       act(() => {
    //         result.current.fetch()
    //       })
    //
    //       await waitForNextUpdate()
    //       expect(result.all.length).toBe(3)
    //       expect(result.all.map(mapSeriailzeData)).toMatchInlineSnapshot(`
    // Array [
    //   Object {
    //     "error": null,
    //     "initialized": false,
    //     "loading": true,
    //     "res": undefined,
    //   },
    //   Object {
    //     "error": [Error: test],
    //     "initialized": false,
    //     "loading": false,
    //     "res": undefined,
    //   },
    //   Object {
    //     "error": [Error: test],
    //     "initialized": false,
    //     "loading": false,
    //     "res": undefined,
    //   },
    // ]
    // `)
    //     })
  })

  describe('preload', function () {
    beforeEach(() => {
      fetchData.mockClear()
    })

    const alwaysTest = async (preloadConfig: any = fetchData) => {
      const p = preload([preloadConfig])
      expect(fetchData).toHaveBeenCalledTimes(1)

      const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
      await waitForNextUpdate()
      expect(result.current[2]).toMatchObject({
        res: {
          age: 12,
          name: 'imcuttle'
        },
        initialized: true,
        loading: false
      })
      await renderHook(() => useFetcher(fetchData)).waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(1)

      await (async function () {
        fetchData.mockClear()
        p()

        const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
        await waitForNextUpdate()
        expect(result.current[2]).toMatchObject({
          res: {
            age: 12,
            name: 'imcuttle'
          },
          initialized: true,
          loading: false
        })

        expect(fetchData).toHaveBeenCalledTimes(1)
        await renderHook(() => useFetcher(fetchData)).waitForNextUpdate()
        expect(fetchData).toHaveBeenCalledTimes(2)
      })()
    }
    it('function,default', () => alwaysTest())
    it('function,always', () => alwaysTest({ fetcher: fetchData, always: true }))

    it('function,once', async () => {
      const p = preload([{ fetcher: fetchData, once: true }])
      expect(fetchData).toHaveBeenCalledTimes(1)

      const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
      await waitForNextUpdate()
      expect(result.current[2]).toMatchObject({
        res: {
          age: 12,
          name: 'imcuttle'
        },
        initialized: true,
        loading: false
      })
      expect(fetchData).toHaveBeenCalledTimes(1)
      await renderHook(() => useFetcher(fetchData)).waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(2)
    })

    it('function,once,key', async () => {
      const p = preload([{ fetcher: fetchData, key: 'fetchData', once: true }])
      expect(fetchData).toHaveBeenCalledTimes(1)

      const { result, waitForNextUpdate } = renderHook(() => useFetcher(fetchData))
      await waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(2)
      await renderHook(() => useFetcher(fetchData)).waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(3)

      await renderHook(() => useFetcher(fetchData, { key: 'fetchData' })).waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(3)

      await renderHook(() => useFetcher(fetchData, { key: 'fetchData' })).waitForNextUpdate()
      expect(fetchData).toHaveBeenCalledTimes(4)
    })
  })

  // describe('PluginTappable', function () {
  //   it('spec', async () => {
  //     const normal1 = () => {}
  //     const normal2: any = { priority: 0, callback: 'normal2' }
  //     const priority_100: any = { priority: 100, callback: 'priority_100' }
  //     const priority_min_safe: any = { priority: Number.MIN_SAFE_INTEGER, callback: 'priority_min_safe' }
  //     const priority_max_safe: any = { priority: Number.MAX_SAFE_INTEGER, callback: 'priority_max_safe' }
  //     const priority_min: any = { priority: Number.MIN_VALUE, callback: 'priority_min' }
  //     const priority_max: any = { priority: Number.MAX_VALUE, callback: 'priority_max' }
  //     const priority_infinity: any = { priority: Infinity, callback: 'priority_infinity' }
  //     const top1: any = { priority: TOP_PRIORITY, callback: 'top1' }
  //     const top2: any = { priority: TOP_PRIORITY, callback: 'top2' }
  //     const bottom1: any = { priority: BOTTOM_PRIORITY, callback: 'bottom1' }
  //     const bottom2: any = { priority: BOTTOM_PRIORITY, callback: 'bottom2' }
  //
  //     const t = new PluginTappable([
  //       {
  //         normal: [priority_100],
  //         top_bottom: [priority_100, normal1, top1],
  //         complex: [
  //           priority_max_safe,
  //           normal1,
  //           top1,
  //           priority_infinity,
  //           priority_100,
  //           bottom1,
  //           bottom2,
  //           normal2,
  //           top2,
  //           priority_min_safe,
  //         ]
  //       },
  //       {
  //         normal: [normal1, normal2],
  //         top_bottom: [bottom1, bottom2, normal2, top2]
  //       }
  //     ])
  //
  //     expect(t.pickCalls('normal').map((x) => x.callback)).toEqual([normal1, normal2.callback, priority_100.callback])
  //     expect(t.pickCalls('top_bottom').map((x) => x.callback)).toEqual([
  //       top1.callback,
  //       top2.callback,
  //       normal1,
  //       normal2.callback,
  //       priority_100.callback,
  //       bottom2.callback,
  //       bottom1.callback
  //     ])
  //     expect(t.pickCalls('complex').map((x) => x.callback)).toEqual([
  //       top1.callback,
  //       top2.callback,
  //       priority_min_safe.callback,
  //       normal1,
  //       normal2.callback,
  //       priority_100.callback,
  //       priority_max_safe.callback,
  //       priority_infinity.callback,
  //       bottom2.callback,
  //       bottom1.callback
  //     ])
  //   })
  // })
})
