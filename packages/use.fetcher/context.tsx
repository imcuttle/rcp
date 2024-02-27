import * as React from 'react'
import { TFetcherPlugin } from './types'

export interface TFetcherContext<T = any> {
  cache?: Map<any[], Promise<any> | any[]>
  plugins?: Array<{
    [P in keyof TFetcherPlugin<T>]: TFetcherPlugin<T>[P]
  }>
  disableDependencyCollect?: boolean
}

export const globalContextValues: TFetcherContext = {
  cache: new Map(),
  plugins: [],
  disableDependencyCollect: false
}

export function assignGlobalFetchConfigValues(values: Partial<typeof globalContextValues>) {
  Object.assign(globalContextValues, values)
}

export function addGlobalPlugins(...plugins: TFetcherContext['plugins']) {
  if (process.env.NODE_ENV !== 'production') {
    plugins.forEach((plg) => {
      if (globalContextValues.plugins.includes(plg)) {
        console.error(`[useFetcher Warn] exists duplicate plugin`, plg)
      }
    })
  }
  globalContextValues.plugins.push(...plugins)

  return () => removeGlobalPlugins(...plugins)
}

export function removeGlobalPlugins(...plugins: TFetcherContext['plugins']) {
  plugins.forEach((plg) => {
    const i = globalContextValues.plugins.indexOf(plg)
    if (i >= 0) {
      globalContextValues.plugins.splice(i, 1)
    }
  })
}

export const FetcherContext = React.createContext<TFetcherContext>(globalContextValues)

export const fetcherContextProviderResolveKeys: string[] = Object.keys(globalContextValues)

export const FetcherContextProvider = ({
  children,
  ...props
}: {
  children?: any
} & TFetcherContext) => {
  const memoVals = React.useMemo<TFetcherContext>(
    () => {
      return fetcherContextProviderResolveKeys.reduce((acc, k) => {
        return {
          ...acc,
          [k]: Object.hasOwnProperty.call(props, k) ? props[k] : globalContextValues[k]
        }
      }, {})
    },
    fetcherContextProviderResolveKeys.map((k) => props[k])
  )
  return <FetcherContext.Provider value={memoVals}>{children}</FetcherContext.Provider>
}
export const FetcherContextConsumer = FetcherContext.Consumer
export const useFetcherContext = () => {
  return React.useContext(FetcherContext)
}
