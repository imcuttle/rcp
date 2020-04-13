/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
import { FunctionComponent, ComponentClass } from 'react'
export declare type TypeLoadingWrapperProps = {
  isLoading: boolean
  renderLoadingDelayMs?: number
  withDelayRenderFirstly?: boolean
  className?: string
  LoadingComponent: FunctionComponent | ComponentClass | string
}
export default class LoadingWrapper extends React.PureComponent<TypeLoadingWrapperProps> {
  static defaultProps: {
    isLoading: boolean
    renderLoadingDelayMs: number
    withDelayRenderFirstly: boolean
    LoadingComponent: any
  }
  state: {
    couldRender: boolean
  }
  timer: any
  killTimer(): void
  register(): void
  updateTimer(prevProps: any, isFirst?: boolean): void
  componentDidMount(): void
  componentDidUpdate(prevProps: any): void
  readonly couldRender: boolean
  render(): JSX.Element
}
