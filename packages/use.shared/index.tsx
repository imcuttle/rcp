/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useMemo } from 'react'
import * as React from 'react'
import useFetcher, { TFetcher, TFetcherResult } from '@rcp/use.fetcher'
import { suspense, suspenseForwardRef } from '@rcp/use.fetcher'
import useForceUpdate from '@rcp/use.forceupdate'
import usePersistFn from '@rcp/use.persistfn'

export { suspense, suspenseForwardRef }

export function useSharedProvider<T>(
  CreateFetcherSymbol: TFetcher<T>,
  { key, ...opts }: Parameters<typeof useFetcher>[1] = {},
  deps?: Parameters<typeof useFetcher>[2]
) {
  // @ts-expect-error
  const result = useFetcher<T>(CreateFetcherSymbol, { ...opts, key }, deps)

  const [, , entity] = result
  const map = useSharedMap()
  const updateMap = useSharedUpdateMap()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcherKey = useMemo(() => key || CreateFetcherSymbol, [key || CreateFetcherSymbol])

  // 同步写
  if (entity.res) {
    map.set(fetcherKey, result)
  } else {
    map.delete(fetcherKey)
  }

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
  }, [fetcherKey, entity.res, updateMap])

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

  return map.get(valueSymbol) || [undefined, undefined, {}]
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
