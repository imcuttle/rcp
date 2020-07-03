import * as React from 'react'
import tinyI18n, { TinyI18n } from 'tiny-i18n'
import useI18nCore, { Dictionary, UseI18nOptions } from '@rcp/use.i18n'

export * from '@rcp/use.i18n'
export const I18nContext = React.createContext<TinyI18n>(tinyI18n)

function useForceUpdate() {
  const [v, set] = React.useState(1)
  const update = React.useCallback(() => {
    set(v => v + 1)
  }, [])
  return [v, update]
}

const wrapFn = (fn, forceUpdate) => {
  if (!fn) {
    return fn
  }
  return (...argv) => {
    const result = fn(...argv)
    forceUpdate()
    return result
  }
}

export function I18nProvider({ tinyI18n, children, ...props }: UseI18nOptions & { children?: any }) {
  const i18n = useI18nCore(
    {},
    {
      tinyI18n,
      ...props
    }
  )

  const [v, forceUpdate] = useForceUpdate()

  const value = React.useMemo(
    () => {
      return {
        ...i18n,
        origin: i18n,
        setLanguage: wrapFn(i18n.setLanguage, forceUpdate),
        extendDictionary: wrapFn(i18n.extendDictionary, forceUpdate),
        setDictionary: wrapFn(i18n.setDictionary, forceUpdate)
      }
    },
    [v, forceUpdate, i18n]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const I18nConsumer = I18nContext.Consumer

export const withTinyI18n = function<PropsType = any, RefType = any>(Component) {
  return class WithTinyI18n<PropsType> extends React.Component {
    originRef = React.createRef<RefType>()
    render() {
      return (
        <I18nConsumer>
          {tinyI18n => <Component ref={this.originRef} tinyI18n={tinyI18n} {...this.props} />}
        </I18nConsumer>
      )
    }
  }
}

export function useI18nContext() {
  return React.useContext(I18nContext)
}

export default function useI18n(presetDict: Dictionary, opts?: UseI18nOptions) {
  const tinyI18n = useI18nContext() || {}
  return useI18nCore(presetDict, {
    // @ts-ignore
    tinyI18n: tinyI18n.origin || tinyI18n,
    ...opts
  })
}
