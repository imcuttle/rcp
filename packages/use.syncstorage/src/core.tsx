/**
 * @file index.ts
 * @author 余聪
 *
 */

import useUncontrolled from '@rcp/use.uncontrolled'
import * as isEqual from 'lodash.isequal'
import { stringify } from 'javascript-stringify'
import { useRef } from 'react'
import * as React from 'react'

import usePersistFn from '@rcp/use.persistfn'

export type RegisteredStateSyncOptions = Parameters<typeof useUncontrolled>[0] & { disabled?: boolean }

export abstract class Storage<V = any> {
  protected abstract _read(key: any): string

  protected abstract _write(key: any, val: string | null, rawValue?: V): void

  public abstract readAll(): any

  protected abstract serializable: ISerializable<V>

  public initialValue: any

  public read(key: any): V | undefined {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const value = this.serializable.deserialize(this._read(key))

      if (this.initialValue != null) {
        if (typeof this.initialValue === 'boolean') {
          return !!value as any
        }
        if (value != null && typeof this.initialValue === 'number') {
          return Number(value) as any
        }
        if (value != null && typeof this.initialValue === 'string') {
          return String(value) as any
        }
      }

      return value
    } catch (err) {
      console.error(err)
    }
  }

  public write(key: any, val: V | null) {
    try {
      if (val == null) {
        // @ts-expect-error
        // eslint-disable-next-line no-underscore-dangle
        return this._write(key, val)
      }

      // eslint-disable-next-line no-underscore-dangle
      this._write(key, this.serializable.serialize(val), val)
    } catch (err) {
      console.error(err)
      return false
    }
  }
}

export interface ISerializable<V> {
  serialize: (val: V) => string
  deserialize: (val: string) => V
}

export class JavaScriptSerializable<V> implements ISerializable<V> {
  // eslint-disable-next-line class-methods-use-this
  deserialize(val: string): V {
    let result: any = val
    ;[
      (v) => JSON.parse(v),
      (v) => {
        if ((v.startsWith('[') && v.endsWith(']')) || (v.startsWith('{') && v.endsWith('}'))) {
          // eslint-disable-next-line no-eval
          return eval(`(function() {return ${v}}())`)
        }
        throw new Error('skip')
      }
    ].some((getVal) => {
      try {
        result = getVal(val)
        return true
      } catch (e) {
        return false
      }
    })
    return result
  }

  // eslint-disable-next-line class-methods-use-this
  serialize(val: V): string {
    if (typeof val === 'string') {
      return val
    }
    return stringify(val) || ''
  }
}

export class JSONSerializable<V> implements ISerializable<V> {
  // eslint-disable-next-line class-methods-use-this
  deserialize(val: string): V {
    let result: any = val
    ;[(v) => JSON.parse(v)].some((getVal) => {
      try {
        result = getVal(val)
        return true
      } catch (e) {
        return false
      }
    })
    return result
  }

  // eslint-disable-next-line class-methods-use-this
  serialize(val: V): string {
    return JSON.stringify(val)
  }
}

export function useStorageSync<T>(
  key: string | undefined,
  initialValue: T,
  {
    disabled,
    storageCreator,
    storageCreatorDeps = [],
    eq = isEqual,
    ...opts
  }: Parameters<typeof useUncontrolled>[0] & {
    storageCreator?: (...arg: any[]) => Storage
    storageCreatorDeps?: any[]
    disabled?: boolean
  } = {}
): [T, (newValue: T | ((value: T) => T)) => void] {
  const eqFn = usePersistFn(eq)
  const condRef = useRef<any>(null)
  /* eslint-disable react-hooks/rules-of-hooks */
  // 以下判断条件只能写死 key || disabled
  if (!key || disabled) {
    if (condRef.current === 'enable') {
      throw new Error('useStorageSync 不能动态关闭')
    }

    condRef.current = 'disable'
    return useUncontrolled<T>({
      // @ts-expect-error
      defaultValue: initialValue,
      eq: eqFn,
      ...opts
    })
  }

  if (condRef.current === 'disable') {
    throw new Error('useStorageSync 不能动态开启')
  }
  condRef.current = 'enable'
  const storageCreatorFn = usePersistFn(storageCreator)
  const storage = React.useMemo(() => {
    return storageCreatorFn(...storageCreatorDeps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...storageCreatorDeps])
  storage.initialValue = initialValue

  const readValue = React.useMemo(() => storage.read(key), [key, storage])
  // const remove = usePersistFn(() => {
  //   storage.write(key, null);
  // });
  // 暂时去除该逻辑，会影响微前端跳转
  // React.useLayoutEffect(() => {
  //   return remove;
  // }, [remove]);
  const [v, setVal] = useUncontrolled<T>({
    ...opts,
    eq: eqFn,
    defaultValue: initialValue,
    value: readValue ?? opts.value
  })
  const initRef = React.useRef(false)
  React.useLayoutEffect(() => {
    initRef.current = false
  }, [readValue])

  React.useLayoutEffect(() => {
    // if (!initRef.current) {
    if (v !== initialValue && opts.onChange) {
      opts.onChange(v)
    }
    // eslint-disable-next-line
  }, [])

  React.useLayoutEffect(() => {
    // 第一次的时候不进行写
    if (!initRef.current) {
      initRef.current = true
      return
    }
    if (!eqFn(storage.read(key), v)) {
      storage.write(key, v)
    }
  }, [eqFn, storage, key, v])

  return [v, setVal]
}
