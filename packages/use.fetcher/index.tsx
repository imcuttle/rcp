/**
 * @file index.ts
 * @author 余聪
 *
 */
import * as React from 'react'
// @ts-ignore
import * as isShallowEqual from 'shallowequal'
import useUncontrolled from '@rcp/use.uncontrolled'
import * as castArray from 'lodash.castarray'
import * as isEqual from 'lodash.isequal'
import useForceUpdate from '@rcp/use.forceupdate'
import usePersistFn from '@rcp/use.persistfn'
import useCustomCompareEffect from '@rcp/use.compareeffect'
import { PropsWithoutRef, RefAttributes, Suspense, SuspenseProps } from 'react'
import { useFetcherContext } from './context'
import { useReplacedValue } from './replacer'
import { TFetcher, TFetcherEntity, TFetcherOptions, TFetcherResult, TPreFetchParams } from './types'
import { usePluginTapable } from './plugin-tappable'
import { decorateEntity } from './decrease-render-times'

export * from './types'
export * from './context'
export * from './preload'
export * from './replacer'

export function suspense<T extends React.ComponentType<P>, P>(Comp: T, config: SuspenseProps) {
  return function SuspenseComponent(props: P) {
    return (
      <Suspense {...config}>
        {/*// @ts-expect-error*/}
        <Comp {...props} />
      </Suspense>
    )
  }
}

export function suspenseForwardRef<Ref, P>(
  Comp: React.ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<Ref>>,
  config: SuspenseProps
) {
  return React.forwardRef<Ref, P>(function SuspenseComponent(props: P, ref) {
    return (
      <Suspense {...config}>
        <Comp ref={ref} {...props} />
      </Suspense>
    )
  })
}

function findCacheKey(currentKey: any, eq = isShallowEqual, cache: Map<any, any>) {
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

function setRefCurrent(ref: { current?: any }, value) {
  const tmp = ref.current
  ref.current = value
  return tmp !== ref.current
}

export default function useFetcher<T, ARG extends any[]>(
  _fetcher: TFetcher<T, ARG>,
  _fetcherOptions: TFetcherOptions<T> = {},
  // @ts-ignore
  _deps: ARG = []
): TFetcherResult<T> {
  const { cache, disableDependencyCollect } = useFetcherContext()
  const tapable = usePluginTapable()

  const preFetchParams: TPreFetchParams<T, ARG> = {
    fetcherOptions: _fetcherOptions,
    fetcher: _fetcher,
    deps: _deps,
    state: {}
  }
  const afterParams = tapable.callTransformSync('preFetchHooks', preFetchParams)
  const { fetcher: getter, deps, fetcherOptions } = afterParams

  const {
    onError,
    data,
    defaultData,
    key,
    catchError,
    onChange,
    suspense,
    eq = 'shadow',
    useEffect = React.useEffect,
    useCallFetchEffect = React.useEffect
  } = fetcherOptions

  const keyOrFetcher = useReplacedValue<any, TFetcher>(key || getter, { extraArgs: [afterParams] })
  const fetcher = React.useMemo(() => {
    return typeof keyOrFetcher === 'function' ? keyOrFetcher : getter
  }, [keyOrFetcher, getter])
  const [val, setVal] = useUncontrolled<T>({
    value: data,
    defaultValue: typeof fetcher !== 'function' ? fetcher : defaultData,
    useEffect,
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
  const pureFetchRef = React.useRef(() => {})
  const internalFetchRef = React.useRef(() => {})
  const forceUpdateRef = React.useRef(() => {})
  const [_forceUpdate, v] = useForceUpdate()
  const forceUpdate = (forceUpdateRef.current = _forceUpdate)

  const getEntity = usePersistFn((overwriteProps?) => {
    return {
      initialized: initializedRef.current,
      res: val,
      setResponse: setVal,
      loading: isLoadingRef.current,
      error: errorRef.current,
      fetch: fetchRef.current,
      pureFetch: pureFetchRef.current,
      _internalFetch: internalFetchRef.current,
      forceUpdate,
      ...overwriteProps
    } as TFetcherEntity<T>
  })
  const getResult = usePersistFn((overwriteProps?) => {
    const entity = getEntity(overwriteProps)
    return [entity.res, entity.setResponse, entity] as TFetcherResult<T>
  })

  const fetch = usePersistFn<TFetcherEntity<T>['_internalFetch']>(
    async (params = [], { shouldUpdate = true, preAppendParams = [], appendParams = [] } = {}) => {
      if (typeof fetcher !== 'function') {
        return getResult()
      }

      let updated = false
      try {
        if (!isLoadingRef.current) {
          isLoadingRef.current = true
          if (!suspense && shouldUpdate && trackResult.hitsDep('loading')) {
            forceUpdate()
          }
        }

        let runParams = (deps || ([] as any)).slice()
        params.forEach((p, i) => {
          runParams[i] = p
        })
        runParams = preAppendParams.concat(runParams).concat(appendParams)
        // @ts-ignore
        const data = await fetcher(...runParams)
        const isInitializedUpdated = setRefCurrent(initializedRef, true)
        const isErrorUpdated = setRefCurrent(errorRef, null)
        isLoadingRef.current = false
        // trigger update
        if (!suspense) {
          setVal(data)
          if (
            (shouldUpdate && val === data && trackResult.hitsDep('loading')) ||
            (isInitializedUpdated && trackResult.hitsDep('initialized')) ||
            (isErrorUpdated && trackResult.hitsDep('error'))
          ) {
            forceUpdate()
          }
        }
        updated = true
        return getResult({ res: data })
      } catch (error) {
        errorRef.current = error
        onError?.(error)
        if (process.env.NODE_ENV !== 'production') {
          if (typeof catchError !== 'undefined' && catchError && suspense) {
            console.error('[rcp:use.fetcher] catchError is not recommended when `suspense` is true. It cases ')
          }
        }
        // 1. 传入 catchError = false
        // 2. 没有传入catchError，但使用了 error
        // 3. 没有传入catchError，使用 suspense
        if (
          (typeof catchError !== 'undefined' && !catchError) ||
          (typeof catchError === 'undefined' && !trackResult.hitsDep('error')) ||
          (typeof catchError === 'undefined' && suspense)
        ) {
          if (suspense) {
            console.error(error)
          }
          throw error
        }
      } finally {
        isLoadingRef.current = false
        if (!updated && !suspense && shouldUpdate) {
          if (
            !errorRef.current ||
            (errorRef.current && ((typeof catchError !== 'undefined' && catchError) || trackResult.hitsDep('error')))
          ) {
            forceUpdate()
          }
        }
      }

      return getResult()
    }
  )
  internalFetchRef.current = fetch
  fetchRef.current = usePersistFn((...params: any[]) => {
    return fetch(params)
  })
  pureFetchRef.current = usePersistFn((...params: any[]) => {
    return fetch(params, { shouldUpdate: false })
  })

  // @ts-ignore
  let currentKey = React.useMemo(() => (key != null ? [key] : [deps, fetcher]), [key, ...(deps || []), fetcher])

  React.useLayoutEffect(() => {
    return () => {
      if (suspense) {
        const key = findCacheKey(currentKey, eqFn, cache)
        cache.delete(key)
      }
    }
  }, [suspense, currentKey, cache])

  if (suspense) {
    const key = findCacheKey(currentKey, eqFn, cache)
    const promiseOrEntity = cache.get(key)
    if (promiseOrEntity) {
      if (promiseOrEntity && typeof (promiseOrEntity as any).then === 'function') {
        // @ts-ignore
        if (promiseOrEntity.error) {
          const cb = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : process.nextTick
          cb(() => {
            cache.delete(key)
          })
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
    eqDepsFn,
    { useEffect: useCallFetchEffect }
  )

  const ent = getEntity()

  let entity = tapable.callTransformSync('unsuspenseEntityTransformHooks', ent, fetcherOptions, afterParams)
  const trackResult = decorateEntity(entity, undefined, {
    disabled: fetcherOptions.disableDependencyCollect ?? disableDependencyCollect ?? false
  })
  entity = trackResult.entity

  return [entity.res, entity.setResponse, entity] as TFetcherResult<T>
}
