/**
 * @file index.ts
 * @author imcuttle
 *
 */
/// <reference types="node" />
import * as React from 'react'
import { EventEmitter } from 'events'
import * as PropTypes from 'prop-types'
import { ClassAttributes } from 'react'
export type InputType = {
  newValue?: string
  oldValue?: string
}
export declare function bindKeepAliveLifeCycle<T extends React.ComponentType>(Component: T): T
export type KeepAlivePropsTypes = {
  uniqKey: string
  disabled?: boolean
} & ClassAttributes<KeepAlive>
export type KeepAlivePropsState = {
  components: {}
}
export default class KeepAlive extends React.PureComponent<KeepAlivePropsTypes, KeepAlivePropsState> {
  static propTypes: {
    uniqKey: PropTypes.Validator<string>
  }
  emitter: EventEmitter
  static childContextTypes: {
    getPrevUniqKey: PropTypes.Requireable<(...args: any[]) => any>
    uniqKey: PropTypes.Requireable<string>
    disabled: PropTypes.Requireable<boolean>
    emitter: PropTypes.Requireable<any>
  }
  constructor(props: any, context: any)
  getChildContext(): {
    getPrevUniqKey: () => string
    disabled: boolean
    uniqKey: string
    emitter: EventEmitter
  }
  UNSAFE_componentWillReceiveProps(nextProps: any): void
  prevUniqKey: string
  UNSAFE_componentWillUpdate(next: any): void
  componentDidUpdate(prev: any): void
  render(): React.JSX.Element
}
