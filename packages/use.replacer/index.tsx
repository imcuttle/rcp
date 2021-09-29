/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useContext } from 'react'
import * as React from 'react'

export interface Replacer<T = any, P extends T = T> {
  with: T
  as: P
}

export const ReplacerContext = React.createContext<Replacer[]>([])
// eslint-disable-next-line no-underscore-dangle
const _ReplacerProvider = ReplacerContext.Provider
export const ReplacerConsumer = ReplacerContext.Consumer

export const ReplacerProvider: React.FC<{
  replacers?: Replacer[]
}> = ({ children, replacers = [] }) => (
  // eslint-disable-next-line react/jsx-pascal-case
  <_ReplacerProvider value={replacers}>{children}</_ReplacerProvider>
)

export function useReplacers() {
  return useContext(ReplacerContext)
}

export function useReplacedValue<T, P extends T = T>(value: T): P {
  const replacers = useReplacers()

  return React.useMemo(() => {
    if (replacers && replacers.length) {
      const replacer = replacers.find((replacer) => replacer.with === value)
      if (replacer) {
        return replacer.as
      }
    }
    return value
  }, [replacers, value])
}
