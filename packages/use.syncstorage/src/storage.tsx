import useForceUpdate from '@rcp/use.forceupdate'
import * as React from 'react'
import { ISerializable, JSONSerializable, RegisteredStateSyncOptions, Storage, useStorageSync } from './core'

export class StorageArea<V> extends Storage<V> {
  public readAll() {
    return { ...this.storageArea }
  }

  // eslint-disable-next-line no-underscore-dangle
  protected _read(key?: any): string | any {
    return this.readAll()[key]
  }

  // eslint-disable-next-line no-underscore-dangle
  protected _write(key: any, str: any): void {
    if (str == null) {
      this.storageArea.removeItem(key)
    } else {
      this.storageArea.setItem(key, str)
    }
  }

  constructor(
    public storageArea: typeof localStorage = globalLocalStorage,
    protected serializable: ISerializable<V> = new JSONSerializable<V>()
  ) {
    super()
  }
}

const globalLocalStorage = typeof window !== 'undefined' ? window.localStorage : null

export function useLocalStorageStateSync<T>(
  key: string,
  initialValue: T,
  { storage = globalLocalStorage, ...opts }: RegisteredStateSyncOptions & { storage?: typeof window.localStorage } = {}
) {
  const [forceUpdate, v] = useForceUpdate()
  React.useEffect(() => {
    const handle = (evt: StorageEvent) => {
      if (evt.key === key && evt.storageArea === storage) {
        forceUpdate()
      }
    }
    window.addEventListener('storage', handle)
    return () => window.removeEventListener('storage', handle)
  }, [key, forceUpdate, storage])

  return useStorageSync<T>(key, initialValue, {
    ...opts,
    disabled: !storage ? true : opts.disabled,
    storageCreator: (storage) => new StorageArea(storage),
    // 触发 storageCreator 创建，重新进行 read 赋值
    storageCreatorDeps: [storage, v]
  })
}
