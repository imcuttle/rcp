/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useContext } from 'react'
import * as React from 'react'

export interface Replacer<T = any, P extends T = T> {
  with: T
  as?: P
  transformAs?: (input: T, replacer: this, ...args: any[]) => P
}

export function factory() {
  const globalReplacerContextValues: Replacer[] = []
  const ReplacerContext = React.createContext<Replacer[]>(globalReplacerContextValues)
  // eslint-disable-next-line no-underscore-dangle
  const _ReplacerProvider = ReplacerContext.Provider
  const ReplacerConsumer = ReplacerContext.Consumer

  const ReplacerProvider: React.FC<{
    replacers?: Replacer[]
  }> = ({ children, replacers = globalReplacerContextValues }) => (
    // eslint-disable-next-line react/jsx-pascal-case
    <_ReplacerProvider value={replacers}>{children}</_ReplacerProvider>
  )

  function useReplacers() {
    return useContext(ReplacerContext)
  }

  function useReplacedValue<T, P extends T = T>(value: T, { extraArgs = [] }: { extraArgs?: any[] } = {}): P {
    const replacers = useReplacers()

    const extraArgsRef = React.useRef(extraArgs)
    extraArgsRef.current = extraArgs

    const matchReplacer = React.useMemo(() => {
      if (replacers && replacers.length) {
        return replacers.find((replacer) => replacer.with === value)
      }
    }, [replacers, value])

    return (
      React.useMemo(() => {
        if (matchReplacer) {
          if (typeof matchReplacer.transformAs === 'function') {
            return matchReplacer.transformAs(matchReplacer.with, matchReplacer, ...extraArgsRef.current)
          }
          return matchReplacer.as
        }
      }, [matchReplacer]) || value
    )
  }

  return {
    globalReplacerContextValues,
    ReplacerContext,
    ReplacerConsumer,
    ReplacerProvider,
    useReplacers,
    useReplacedValue
  }
}

const {
  globalReplacerContextValues,
  ReplacerContext,
  ReplacerConsumer,
  ReplacerProvider,
  useReplacers,
  useReplacedValue
} = factory()

export {
  globalReplacerContextValues,
  ReplacerContext,
  ReplacerConsumer,
  ReplacerProvider,
  useReplacers,
  useReplacedValue
}
