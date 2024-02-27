import { TFetcherEntity } from './types'

const nodeNextTick =
  typeof process !== 'undefined' && process && typeof process.nextTick === 'function'
    ? process.nextTick
    : (fn) => setTimeout(fn)
const nextTick = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : nodeNextTick

export function decorateEntity<E extends Record<any, any> = TFetcherEntity<any>>(
  entity: E,
  keys: Array<keyof E> = ['loading', 'error', 'initialized'],
  { disabled }: { disabled?: boolean } = {}
) {
  if (disabled) {
    return {
      entity,
      hitsDep: (name: keyof E) => {
        return true
      }
    }
  }

  let isSync = true
  nextTick(() => {
    isSync = false
  })
  const syncUsedDepSet: Set<keyof E> = new Set()
  keys.forEach((k) => {
    let value = entity[k]
    Object.defineProperty(entity, k, {
      enumerable: Object.propertyIsEnumerable.call(entity, k),
      configurable: true,
      get(): any {
        if (isSync) {
          syncUsedDepSet.add(k)
        }
        return value
      },
      set(v: any) {
        value = v
      }
    })
  })

  return {
    entity,
    _syncUsedDepSet: syncUsedDepSet,
    hitsDep: (name: keyof E) => {
      return syncUsedDepSet.has(name)
    }
  }
}
