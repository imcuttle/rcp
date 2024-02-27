/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useMemo } from 'react'
import * as React from 'react'
import useFetcher, { TFetcher, TFetcherResult } from '@rcp/use.fetcher'
import { TFetcherOptions, suspense, suspenseForwardRef } from '@rcp/use.fetcher'
import useForceUpdate from '@rcp/use.forceupdate'
import usePersistFn from '@rcp/use.persistfn'

export { suspense, suspenseForwardRef }

export type TSharedProviderOptions<T extends (a: any, opts: TFetcherOptions, ...args: any[]) => TFetcherResult<any>> =
  Parameters<T>[1] & {
    useFetcher?: T
  }

export function useSharedProvider<T, F extends (a: any, opts: TFetcherOptions, ...args: any[]) => TFetcherResult<any>>(
  CreateFetcherSymbol: TFetcher<T>,
  { key, ...opts }: TSharedProviderOptions<F> = {},
  deps?: Parameters<F>[2]
) {
  const useLoader = React.useMemo(() => opts.useFetcher ?? useFetcher, [])
  // @ts-expect-error
  const result = useLoader<T>(CreateFetcherSymbol, { disableDependencyCollect: true, ...opts, key }, deps)

  const [, , entity] = result
  const map = useSharedMap()
  const updateMap = useSharedUpdateMap()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcherKey = useMemo(() => key || CreateFetcherSymbol, [key || CreateFetcherSymbol])

  // 同步写
  map.set(fetcherKey, result)

  React.useLayoutEffect(
    () => () => {
      map.delete(fetcherKey)
    },
    [fetcherKey, map]
  )

  React.useEffect(() => {
    // 异步 batch 更新使用的地方
    const updateList = updateMap.get(fetcherKey)
    if (updateList) {
      updateList.forEach((fn) => fn())
    }
  }, [fetcherKey, entity.res, entity.loading, entity.error, entity.initialized, updateMap])

  return result
}

export function useShared<T>(
  valueSymbol: TFetcher<T>
): [T, (newValue: T) => void, TFetcherResult<T>] | [undefined, undefined, {}] {
  const map = useSharedMap()
  const updateMap = useSharedUpdateMap()
  const [_forceUpdate] = useForceUpdate()

  const prevRef = React.useRef()
  prevRef.current = map.get(valueSymbol)

  const forceUpdate = usePersistFn(() => {
    if (prevRef.current !== map.get(valueSymbol)) {
      _forceUpdate()
    }
  })

  React.useMemo(() => {
    const prevValue = updateMap.get(valueSymbol)
    if (!prevValue) {
      updateMap.set(valueSymbol, [forceUpdate])
    } else if (!prevValue.includes(forceUpdate)) {
      prevValue.push(forceUpdate)
    }
  }, [valueSymbol, updateMap, forceUpdate])

  React.useEffect(
    () => () => {
      const prevValue = updateMap.get(valueSymbol)
      if (prevValue) {
        const index = prevValue.indexOf(forceUpdate)
        prevValue.splice(index, 1)
      }
    },
    [forceUpdate, valueSymbol, updateMap]
  )

  return prevRef.current || [undefined, undefined, {}]
}

export function useSharedFetcher<T, F extends (a: any, opts: TFetcherOptions, ...args: any[]) => TFetcherResult<any>>(
  createFetcherSymbol: TFetcher<T>,
  { key, ...opts }: TSharedProviderOptions<F> = {},
  deps?: Parameters<F>[2]
): TFetcherResult<T> {
  const fetcherKey = React.useMemo(() => {
    return key || createFetcherSymbol
  }, [key || createFetcherSymbol])

  const map = useSharedMap()
  const useHook = React.useMemo(() => {
    if (map.get(fetcherKey)) {
      return () => useShared(fetcherKey)
    }
    return () => {
      return useSharedProvider(createFetcherSymbol, { key, ...opts }, deps)
    }
  }, [])

  return useHook() as any
}

const SharedContext = React.createContext<Map<TFetcher<any>, any>>(new Map())
const SharedUpdateContext = React.createContext<Map<TFetcher<any>, Array<() => void>>>(new Map())

export const useSharedMap = () => React.useContext(SharedContext)

export const useSharedUpdateMap = () => React.useContext(SharedUpdateContext)

export const SharedProvider: React.FC<{
  _internal?: {
    valuesMap: Map<any, any>
    updateMap: Map<any, any>
  }
}> = React.memo(({ children, _internal }) => {
  const [map] = React.useState(() => _internal?.valuesMap || new Map())
  const [updateMap] = React.useState(() => _internal?.updateMap || new Map())

  return (
    <SharedContext.Provider value={map}>
      <SharedUpdateContext.Provider value={updateMap}>{children}</SharedUpdateContext.Provider>
    </SharedContext.Provider>
  )
})
