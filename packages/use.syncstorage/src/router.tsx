import { History } from 'history'
import { useHistory, useLocation } from 'react-router'
import * as qs from 'qs'
import { IParseOptions, IStringifyOptions } from 'qs'

import { ISerializable, JavaScriptSerializable, RegisteredStateSyncOptions, Storage, useStorageSync } from './core'

export class RouterHistoryStorage<V> extends Storage<V> {
  public readAll() {
    return qs.parse(this.history.location.search.slice(1), this.qsParserOptions)
  }

  protected _read(key?: any): string | any {
    return this.readAll()[key]
  }

  protected _write(key: any, str: any, rawVal: any): void {
    const current = this.readAll()
    if (str == null) {
      delete current[key]
    } else {
      current[key] = rawVal
    }

    this.history.replace({
      ...this.history.location,
      search: `?${qs.stringify(current, this.qsStringifyOptions)}`
    })
  }

  constructor(
    public history: History,
    protected qsParserOptions: IParseOptions = { allowDots: true },
    protected qsStringifyOptions: IStringifyOptions = { allowDots: true },
    protected serializable: ISerializable<V> = new JavaScriptSerializable<V>()
  ) {
    super()
  }
}

export function useRouterHistoryStateSync<T>(
  key: string | undefined,
  initialValue: T,
  opts?: RegisteredStateSyncOptions
) {
  const history = useHistory()
  const location = useLocation()

  return useStorageSync<T>(key, initialValue, {
    ...opts,
    storageCreator: (history) => new RouterHistoryStorage(history),
    // 触发 storageCreator 创建，重新进行 read 赋值
    storageCreatorDeps: [history, location]
  })
}
