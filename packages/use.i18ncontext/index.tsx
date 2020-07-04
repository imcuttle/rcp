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

/**
 * @public
 * @param opts
 * @param [opts.tinyI18n] {TinyI18n}
 * @param [opts.language] {string}
 * @param [opts.locale] {{}}
 * @example
 * <I18nProvider tinyI18n={tinyI18n} language="zh-cn">
 *   {children}
 * </I18nProvider>
 */
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

/**
 * @public
 * @example
 * <I18nConsumer>
 *   {tinyI18n => <h1>{tinyI18n.i18n('title')}</h1>}
 * </I18nConsumer>
 */
export const I18nConsumer = I18nContext.Consumer

/**
 * @public
 * @example
 * @example
 *
 * class AppView extends React.Component {
 *   render() {
 *     const tinyI18n = this.props.tinyI18n;
 *     return <h1>{tinyI18n.i18n('title')}</h1>
 *   }
 * }
 * const App = withTinyI18n(AppView)
 */
export const withTinyI18n = function<PropsType = any & { tinyI18n: TinyI18n }, RefType = any>(Component) {
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

/**
 * @public
 * @example
 * function App() {
 *   const tinyI18n = useI18nContext()
 * }
 */
export function useI18nContext() {
  return React.useContext(I18nContext)
}

/**
 * @public
 * @example
 * function App() {
 *   const tinyI18n = useI18n({
 *     'zh-cn': {
 *       hi: '你好'
 *     }
 *   })
 *
 *   return <h1>{tinyI18n.i18n('title')}</h1>
 * }
 */
export default function useI18n(presetDict: Dictionary, opts: UseI18nOptions = {}) {
  const tinyI18n = useI18nContext()

  const currentLocale = tinyI18n.getDictionary(opts.language == null ? void 0 : opts.language)

  return useI18nCore(presetDict, {
    // @ts-ignore
    tinyI18n: tinyI18n.origin || tinyI18n,
    ...opts,
    locale: {
      ...currentLocale,
      ...opts.locale
    }
  })
}
