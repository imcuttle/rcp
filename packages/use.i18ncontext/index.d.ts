import * as React from 'react'
import { TinyI18n } from 'tiny-i18n'
import { Dictionary, UseI18nOptions } from '@rcp/use.i18n'
export * from '@rcp/use.i18n'
export declare const I18nContext: React.Context<TinyI18n>
export declare function I18nProvider({
  tinyI18n,
  children,
  ...props
}: UseI18nOptions & {
  children?: any
}): JSX.Element
export declare const I18nConsumer: React.ExoticComponent<React.ConsumerProps<TinyI18n>>
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
export declare function useI18nContext(): TinyI18n
export default function useI18n(presetDict: Dictionary, opts?: UseI18nOptions): TinyI18n
