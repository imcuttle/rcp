import * as React from 'react'
import { globalReplacerContextValues, Replacer, useReplacers } from './replacer'
import { useFetcherContext } from './context'

export interface TPreloadOptions {
  replacerValues?: Replacer[]
}

export function createPreloadHandle<Input, Opts extends TPreloadOptions = TPreloadOptions>({
  handleInput
}: {
  handleInput: (
    input: Input,
    opts?: Opts
  ) =>
    | {
        replacerWith: Replacer['with']
        replacerAs?: Replacer['as']
        replacerTransformAs?: Replacer['transformAs']
        fetch: () => Promise<any> | any
      }
    | undefined
}) {
  // @ts-ignore
  return (inputs: Input[], opts: Opts = {}) => {
    const { replacerValues = globalReplacerContextValues } = opts
    const replacerList: Replacer[] = []
    const fetchList = []
    inputs.forEach((input) => {
      const rlt = handleInput(input, opts)
      if (rlt) {
        rlt.replacerWith &&
          replacerList.push({
            with: rlt.replacerWith,
            transformAs: rlt.replacerTransformAs,
            as: rlt.replacerAs || rlt.fetch
          })
        rlt.fetch && fetchList.push(rlt.fetch)
      }
    })

    replacerValues.push(...replacerList)
    const promise = Promise.all(fetchList.map((f) => f()))

    return Object.assign(
      () => {
        replacerList.forEach((r) => {
          const i = replacerValues.indexOf(r)
          if (i >= 0) {
            replacerValues.splice(i, 1)
          }
        })
      },
      { promise }
    )
  }
}

type FunctionFetcher = () => Promise<any> | any

export interface PreloadRule {
  always?: boolean
  once?: boolean
  cacheTimes?: number
}

export function decorateFetchForPreload(fetch: FunctionFetcher, { once, always = true, cacheTimes }: PreloadRule = {}) {
  let times = cacheTimes
  if (cacheTimes != null) {
    times = cacheTimes
  } else if (once) {
    times = 2
  } else if (always) {
    times = -1
  }

  let cached
  let runTimes = 0

  const isAlreadyNoTimes = () => {
    return times !== -1 && runTimes >= times
  }
  const setCachedResult = (v: any) => {
    cached = v
  }

  function resolvedFetch(...args: any[]) {
    if (isAlreadyNoTimes()) {
      // @ts-ignore
      return fetch(...args)
    }

    if (runTimes > 0) {
      runTimes++
      return cached
    }

    runTimes++
    // @ts-ignore
    setCachedResult(fetch(...args))
    if (typeof cached?.catch === 'function' && typeof cached?.then === 'function') {
      cached.catch(() => {
        runTimes--
      })
    }
    return cached
  }
  return Object.assign(resolvedFetch, {
    isAlreadyNoTimes,
    setCachedResult
  }) as typeof resolvedFetch & {
    isAlreadyNoTimes: typeof isAlreadyNoTimes
    setCachedResult: typeof setCachedResult
  }
}

export type PreloadInput =
  | FunctionFetcher
  | ({ key: any; fetcher: FunctionFetcher } & PreloadRule)
  | ({ fetcher: FunctionFetcher } & PreloadRule)

export const _preloadHandle = (input: PreloadInput) => {
  if (typeof input === 'function') {
    return {
      replacerWith: input,
      fetch: decorateFetchForPreload(input)
    }
  }
  // @ts-ignore
  if (input && !!input.key && typeof input.fetcher === 'function') {
    return {
      // @ts-ignore
      replacerWith: input.key,
      fetch: decorateFetchForPreload(input.fetcher, input)
    }
  }
  if (input && typeof input.fetcher === 'function') {
    return {
      replacerWith: input.fetcher,
      fetch: decorateFetchForPreload(input.fetcher, input)
    }
  }
  return
}

export const preload = createPreloadHandle<PreloadInput>({ handleInput: _preloadHandle })

export function createUsePreload<T, Opts extends TPreloadOptions = TPreloadOptions>(
  preload: (inputs: T[], opts?: Opts) => () => void,
  {
    ctxPickKeys = []
  }: {
    ctxPickKeys?: string[]
  } = {}
) {
  return function usePreload(inputs: T[], opts?: Opts) {
    const replacers = useReplacers()
    const fetcherCtx = useFetcherContext()
    const optsRef = React.useRef(opts)
    optsRef.current = opts

    const extraOpts = React.useMemo(() => {
      if (!fetcherCtx) {
        return
      }
      const opts = {}
      ctxPickKeys.forEach((k) => {
        opts[k] = fetcherCtx[k]
      })
      return opts
    }, [fetcherCtx])

    const dispose = React.useMemo(
      () => preload(inputs, { ...extraOpts, replacerValues: replacers, ...optsRef.current }),
      inputs.concat([replacers, extraOpts] as any)
    )
    React.useLayoutEffect(() => dispose, [dispose])
  }
}

export const usePreload = createUsePreload(preload)
