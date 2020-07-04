import * as React from 'react'
import { TinyI18n } from 'tiny-i18n'
import { Dictionary, UseI18nOptions } from '@rcp/use.i18n'
export * from '@rcp/use.i18n'
export declare const I18nContext: React.Context<TinyI18n>
/**
 * @public
 * @param opts {{}}
 * @param [opts.tinyI18n] {TinyI18n}
 * @param [opts.language] {string}
 * @param [opts.locale] {{}}
 * @example
 * <I18nProvider tinyI18n={tinyI18n} language="zh-cn">
 *   {children}
 * </I18nProvider>
 */
export declare function I18nProvider({
  tinyI18n,
  children,
  ...props
}: UseI18nOptions & {
  children?: any
}): JSX.Element
/**
 * @public
 * @example
 * <I18nConsumer>
 *   {tinyI18n => <h1>{tinyI18n.i18n('title')}</h1>}
 * </I18nConsumer>
 */
export declare const I18nConsumer: React.ExoticComponent<React.ConsumerProps<TinyI18n>>
/**
 * @public
 * @example
 * class AppView extends React.Component {
 *   render() {
 *     const tinyI18n = this.props.tinyI18n;
 *     return <h1>{tinyI18n.i18n('title')}</h1>
 *   }
 * }
 * const App = withTinyI18n(AppView)
 */
export declare const withTinyI18n: <PropsType = any, RefType = any>(
  Component: any
) => {
  new <PropsType>(props: Readonly<{}>): {
    originRef: React.RefObject<RefType>
    render(): JSX.Element
    context: any
    setState<K extends never>(
      state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K>) | Pick<{}, K>,
      callback?: () => void
    ): void
    forceUpdate(callback?: () => void): void
    readonly props: Readonly<{}> &
      Readonly<{
        children?: React.ReactNode
      }>
    state: Readonly<{}>
    refs: {
      [key: string]: React.ReactInstance
    }
    componentDidMount?(): void
    shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean
    componentWillUnmount?(): void
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void
    getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any
    componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void
    componentWillMount?(): void
    UNSAFE_componentWillMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void
    componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void
    UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void
  }
  new <PropsType>(props: {}, context?: any): {
    originRef: React.RefObject<RefType>
    render(): JSX.Element
    context: any
    setState<K extends never>(
      state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K>) | Pick<{}, K>,
      callback?: () => void
    ): void
    forceUpdate(callback?: () => void): void
    readonly props: Readonly<{}> &
      Readonly<{
        children?: React.ReactNode
      }>
    state: Readonly<{}>
    refs: {
      [key: string]: React.ReactInstance
    }
    componentDidMount?(): void
    shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean
    componentWillUnmount?(): void
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void
    getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any
    componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void
    componentWillMount?(): void
    UNSAFE_componentWillMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void
    componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void
    UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void
  }
  contextType?: React.Context<any>
}
/**
 * @public
 * @example
 * function App() {
 *   const tinyI18n = useI18nContext()
 * }
 */
export declare function useI18nContext(): TinyI18n
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
export default function useI18n(presetDict: Dictionary, opts?: UseI18nOptions): TinyI18n
