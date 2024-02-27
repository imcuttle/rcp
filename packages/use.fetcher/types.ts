import * as React from 'react'
import useUncontrolled from '@rcp/use.uncontrolled'

type UnControlledOptions = Parameters<typeof useUncontrolled>[0]

export type TFetcher<R = any, T extends any[] = any[]> = R | ((...args: T) => Promise<R> | R)

export interface TFetcherEntity<T> {
  initialized: boolean
  res: T
  setResponse?: (value: T) => void
  loading: boolean
  error: any
  fetch: (...params: any[]) => Promise<TFetcherEntity<T>>
  pureFetch: (...params: any[]) => Promise<TFetcherEntity<T>>
  _internalFetch: (
    params?: any[],
    options?: { shouldUpdate?: boolean; preAppendParams?: any[]; appendParams?: any[] }
  ) => Promise<TFetcherResult<T>>
  forceUpdate: () => void
}
export type TFetcherResult<T> = [T, (newVal: T | ((oldValue: T) => T)) => void, TFetcherEntity<T>]
export interface TFetcherOptions<T = any> {
  onChange?: UnControlledOptions['onChange']
  data?: T
  defaultData?: T
  suspense?: boolean
  key?: any
  eq?: ((a: any, b: any) => boolean) | 'deep' | 'shadow'
  catchError?: boolean
  onError?: (err: Error) => void
  useEffect?: typeof React.useEffect
  useCallFetchEffect?: typeof React.useEffect
  disableDependencyCollect?: boolean
}

export interface TPreFetchParams<T, ARG extends any[] = any[]> {
  fetcher: TFetcher<T, ARG>
  fetcherOptions?: TFetcherOptions<T>
  deps?: ARG
  state: Record<any, any>
}
export interface TFetcherPlugin<T = any> {
  unsuspenseEntityTransformHooks?: Array<
    (
      entity: TFetcherEntity<T>,
      options: TFetcherOptions<T>,
      params: TPreFetchParams<T>
    ) => TFetcherEntity<T> | undefined
  >
  preFetchHooks?: Array<(params: TPreFetchParams<T>) => TPreFetchParams<T> | undefined>
}
