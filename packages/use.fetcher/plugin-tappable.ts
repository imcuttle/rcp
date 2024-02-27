import * as React from 'react'
import * as castArray from 'lodash.castarray'
import { useFetcherContext, TFetcherContext } from './context'

type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never

export class PluginTappable<
  T extends Array<Record<string, Array<(...args: any[]) => any>>> = TFetcherContext['plugins']
> {
  // @ts-ignore
  constructor(public plugins: T = []) {}

  pickCalls(name: keyof ArrElement<T>) {
    let fns: Array<(...args: any[]) => any> = []
    this.plugins.forEach((plg) => {
      // @ts-ignore
      if (plg?.[name]) {
        // @ts-ignore
        fns = fns.concat(castArray(plg[name]).filter((x) => typeof x === 'function'))
      }
    })
    return fns
  }

  callTransformSync<N extends keyof ArrElement<T>, R extends Parameters<ArrElement<ArrElement<T>[N]>>[0]>(
    name: N,
    ...inputs: Parameters<ArrElement<ArrElement<T>[N]>>
  ): R {
    const calls = this.pickCalls(name)
    const [input, ...extraArgs] = inputs
    return castArray(calls).reduce((acc, p) => p(acc, ...extraArgs) || acc, input)
  }
}

export function usePluginTapable() {
  const { plugins } = useFetcherContext()
  return React.useMemo(() => new PluginTappable(plugins), [plugins])
}
