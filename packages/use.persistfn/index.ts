import { useRef } from 'react'

const castArray = (value) => {
  if (value == null) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}
type Noop = (...args: any[]) => any
const noop: Noop = () => {}

// @ts-ignore
function usePersistFn<T extends Noop>(fn?: T = noop, decorates: (fn: T) => T | Array<(fn: T) => T> = []): T {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const persistFn = useRef<T>()
  if (!persistFn.current) {
    persistFn.current = (castArray(decorates) || []).reduce(
      (acc, fn) => {
        if (fn) {
          return fn(acc)
        }
        return acc
      },
      function (...args) {
        return fnRef.current?.apply(this, args)
      }
    )
  }

  return persistFn.current
}

export default usePersistFn
