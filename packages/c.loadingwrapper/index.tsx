/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
import * as p from 'prefix-classname'
import { FunctionComponent } from 'react'
import { ComponentClass } from 'react'

const cx = p('')
const c = p('rcp-loading-wrapper__')

export type TypeLoadingWrapperProps = {
  isLoading: boolean
  renderLoadingDelayMs?: number
  withDelayRenderFirstly?: boolean
  className?: string
  LoadingComponent: FunctionComponent | ComponentClass | string
}

export default class LoadingWrapper extends React.PureComponent<TypeLoadingWrapperProps> {
  static defaultProps = {
    isLoading: false,
    // 渲染Loading 延迟ms
    renderLoadingDelayMs: 1000,
    // 是否首次的时候 delay 渲染 loading
    withDelayRenderFirstly: false,
    LoadingComponent: null
  }
  state = {
    couldRender: false
  }
  timer = null

  killTimer() {
    clearTimeout(this.timer)
    this.timer = null
  }

  register() {
    if (this.props.renderLoadingDelayMs) {
      if (this.timer) {
        this.killTimer()
      }

      this.timer = setTimeout(() => {
        this.setState({
          couldRender: true
        })
      }, this.props.renderLoadingDelayMs)
    }
  }

  updateTimer(prevProps, isFirst = false) {
    if (!this.props.isLoading) {
      this.killTimer()
      this.setState({
        couldRender: false
      })
      return
    }

    const couldDelay = (isFirst && this.props.withDelayRenderFirstly) || !isFirst

    if (!couldDelay) {
      if (this.props.isLoading) {
        this.killTimer()
        this.setState({
          couldRender: true
        })
      }
    } else {
      if (this.props.renderLoadingDelayMs) {
        if (this.props.isLoading) {
          this.register()
        }
      } else {
        if (this.props.isLoading) {
          this.killTimer()
          this.setState({
            couldRender: true
          })
        }
      }
    }
  }

  componentDidMount() {
    this.updateTimer({ isLoading: false }, true)
  }

  componentDidUpdate(prevProps) {
    this.updateTimer(prevProps)
  }

  get couldRender() {
    return this.state.couldRender
  }

  render() {
    const { className, LoadingComponent } = this.props
    return (
      <div className={c('container', !this.couldRender && 'hide', className)}>
        {this.props.children}
        <div className={c('mask')}>
          <div className={c('main')}>{!!LoadingComponent && React.createElement(LoadingComponent)}</div>
        </div>
      </div>
    )
  }
}
