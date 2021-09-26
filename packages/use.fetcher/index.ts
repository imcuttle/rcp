/**
 * @file index.ts
 * @author 余聪
 *
 */
/* eslint-disable */
import * as React from 'react'
// @ts-ignore
import isShallowEqual from 'shallowequal'
import useUncontrolled from '@rcp/use.uncontrolled'
import { castArray, isEqual } from 'lodash'
import useForceUpdate from '@rcp/use.forceupdate'
import { useReplacedValue } from '@rcp/use.replacer'
import usePersistFn from '@rcp/use.persistfn'

type UnControlledOptions = Parameters<typeof useUncontrolled>[0]
export type TFetcher<R = any, T extends any[] = any[]> = R | ((...args: T) => Promise<R> | R)

export type TFetcherEntity<T> = {
  initialized: boolean
  res: T
  setResponse?: (value: T) => void
  loading: boolean
  error: any
  fetch: (...params: any[]) => Promise<TFetcherEntity<T>>
  forceUpdate: () => void
}

export type TFetcherResult<T> = [T, (newVal: T | ((oldValue: T) => T)) => void, TFetcherEntity<T>]
export type TFetcherOptions<T = any> = {
  onChange?: UnControlledOptions['onChange']
  data?: T
  defaultData?: T
  suspense?: boolean
  key?: any
  eq?: ((a: any, b: any) => boolean) | 'deep' | 'shadow'
  catchError?: boolean
}

const cache = new Map<any[], Promise<any> | any[]>()

function findCacheKey(currentKey: any, eq = isShallowEqual) {
  currentKey = castArray(currentKey)
  // @ts-ignore
  for (let [eachKey] of cache.entries()) {
    eachKey = castArray(eachKey)
    // @ts-ignore
    const isMatched = eachKey.every((eachK, i) => eq(eachK, currentKey[i]))
    if (isMatched) {
      return eachKey
    }
  }
}

var useCustomCompareEffect = function (effect: any, deps: any, depsEqual: any) {
  var ref = React.useRef(undefined)
  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps
  }
  React.useEffect(effect, ref.current)
}

export default function useFetcher<T, ARG extends any>(
  // @ts-ignore
  getter: TFetcher<T, ARG>,
  { data, defaultData, key, catchError = false, onChange, suspense, eq = 'shadow' }: TFetcherOptions<T> = {},
  // @ts-ignore
  deps: ARG = []
): TFetcherResult<T> {
  const fetcher = useReplacedValue<any, TFetcher>(key || getter)
  const [val, setVal] = useUncontrolled<T>({
    value: data,
    defaultValue: typeof fetcher !== 'function' ? fetcher : defaultData,
    useEffect: React.useEffect,
    onChange
  })
  const eqFn = usePersistFn((a, b) => {
    if (eq === 'deep') {
      return isEqual(a, b)
    }
    if (eq === 'shadow') {
      return isShallowEqual(a, b)
    }
    if (typeof eq === 'function') {
      return eq(a, b)
    }
    return isShallowEqual(a, b)
  })

  const initializedRef = React.useRef(false)
  const isLoadingRef = React.useRef(!suspense)
  const errorRef = React.useRef(null)
  const fetchRef = React.useRef(() => {})
  const forceUpdateRef = React.useRef(() => {})
  const [_forceUpdate, v] = useForceUpdate()
  const forceUpdate = (forceUpdateRef.current = _forceUpdate)

  const getResult = React.useCallback(
    (overwriteProps?) => {
      const entity = {
        initialized: initializedRef.current,
        res: val,
        setResponse: setVal,
        loading: isLoadingRef.current,
        error: errorRef.current,
        fetch: fetchRef.current,
        forceUpdate,
        ...overwriteProps
      }
      return [entity.res, entity.setResponse, entity] as TFetcherResult<T>
    },
    [v, val, forceUpdate, setVal]
  )

  const fetch = usePersistFn(async (...params) => {
    if (typeof fetcher !== 'function') {
      return getResult()
    }

    let updated = false
    try {
      if (!isLoadingRef.current) {
        isLoadingRef.current = true
        !suspense && forceUpdate()
      }

      const depsCloned = (deps || ([] as any)).slice()
      params.forEach((p, i) => {
        depsCloned[i] = p
      })
      // @ts-ignore
      const data = await fetcher(...depsCloned)
      initializedRef.current = true
      errorRef.current = null
      isLoadingRef.current = false
      // trigger update
      !suspense && setVal(data)
      updated = true
      return getResult({ res: data })
    } catch (error) {
      errorRef.current = error
      if (!catchError) {
        if (suspense) {
          console.error(error)
        }
        throw error
      }
    } finally {
      isLoadingRef.current = false
      !updated && !suspense && forceUpdate()
    }

    return getResult()
    // @ts-ignore
  })
  fetchRef.current = fetch

  // @ts-ignore
  let currentKey = React.useMemo(() => (key != null ? [key] : [deps, fetcher]), [key, ...(deps || []), fetcher])

  React.useLayoutEffect(() => {
    return () => {
      if (suspense) {
        const key = findCacheKey(currentKey, eqFn)
        cache.delete(key)
      }
    }
  }, [suspense, currentKey, cache])

  if (suspense) {
    const key = findCacheKey(currentKey, eqFn)
    const promiseOrEntity = cache.get(key)
    if (promiseOrEntity) {
      if (promiseOrEntity && typeof (promiseOrEntity as any).then === 'function') {
        // @ts-ignore
        if (promiseOrEntity.error) {
          // @ts-ignore
          throw promiseOrEntity.error
        }
        throw promiseOrEntity
      }
      // resolved
      return (promiseOrEntity as any).slice()
    }

    const fetchPromise = fetch()
      .then((result) => {
        // suspense 模式下的更新，走的同一份引用
        // todo: 暂不支持 suspense 模式下的更新
        const [v, set, ent] = result
        const resRef = { current: v }

        Object.defineProperty(ent, 'res', {
          get() {
            return resRef.current
          }
        })
        Object.defineProperty(ent, 'setResponse', {
          get() {
            return (newV: any) => {
              throw new Error('suspense 模式下，目前不支持 set 更新数据')

              // if (typeof newV === 'function') {
              //   newV = newV(ent.res);
              // }
              // if (ent.res !== newV) {
              //   resRef.current = newV;
              //   forceUpdateRef.current();
              // }
            }
          }
        })

        // let originFetch = ent.fetch;
        ent.fetch = async (...args) => {
          throw new Error('suspense 模式下，目前不支持 fetch 更新数据')
          // const result = (await originFetch(...args)) as any;
          // Object.assign(ent, omit(result[2], 'setResponse', 'res', 'forceUpdate'));
          // ent.setResponse!(result[2].res);
          // return result;
        }

        // @ts-ignore
        cache.set(
          currentKey,
          Object.defineProperty([null, ent.setResponse, ent], '0', {
            get: () => ent.res
          })
        )
      })
      .catch((error) => {
        // @ts-ignore
        fetchPromise.error = error
      })
    cache.set(currentKey, fetchPromise)
    throw fetchPromise
  }

  const eqDepsFn = usePersistFn((depsA = [], depsB = []) => {
    // @ts-ignore
    return depsA.every((eachA, i) => eqFn(eachA, depsB[i]))
  })

  useCustomCompareEffect(
    () => {
      if (!suspense) {
        fetch()
      }
    },
    // @ts-ignore
    [...(deps || []), suspense],
    eqDepsFn
  )

  return getResult()
}
