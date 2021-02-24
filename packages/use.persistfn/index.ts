/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useRef } from 'react'

type Noop = (...args: any[]) => any
const noop: Noop = () => {}

// @ts-ignore
function usePersistFn<T extends Noop>(fn?: T = noop) {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const persistFn = useRef<T>()
  if (!persistFn.current) {
    persistFn.current = function(...args) {
      // @ts-ignore
      return fnRef.current!.apply(this, args)
    } as T
  }

  return persistFn.current!
}

export default usePersistFn
