/**
 * @file index.ts
 * @author imcuttle
 *
 */

import * as React from 'react'
import { EventEmitter } from 'events'
import * as PropTypes from 'prop-types'
import cx from 'classnames'
import displayName from '@rcp/util.displayname'
import { ClassAttributes, ComponentClass } from 'react'

const KeepAliveContext = {
  getPrevUniqKey: PropTypes.func,
  uniqKey: PropTypes.string,
  disabled: PropTypes.bool,
  emitter: PropTypes.any
}

export type InputType = {
  newValue?: string
  oldValue?: string
}

export function bindKeepAliveLifeCycle<T extends React.ComponentType>(Component: T): T {
  // @ts-ignore
  return class KeepAliveLifeCycle extends Component implements KeepAliveLifeCycle {
    static displayName = `KeepAlive${displayName(Component)}`
    static contextTypes = {
      ...Component.contextTypes,
      ...KeepAliveContext
    }

    context: any
    componentDidUnactive: (input: InputType) => void
    componentWillUnactive: (input: InputType) => void
    componentWillActive: (input: InputType) => void
    componentDidActive: (input: InputType) => void

    __KeepAlive__ = {
      uniqKey: null,
      prevKey: null,
      events: {
        willUnactive: (val, from) => {
          if (val.oldValue === this.__KeepAlive__.uniqKey) {
            this.componentWillUnactive && this.componentWillUnactive(val || {})
          }
        },
        didUnactive: (val, from) => {
          if (val.oldValue === this.__KeepAlive__.uniqKey) {
            this.componentDidUnactive && this.componentDidUnactive(val || {})
          }
        },
        willActive: (val, from) => {
          if (val.newValue === this.__KeepAlive__.uniqKey) {
            this.componentWillActive && this.componentWillActive(val || {})
          }
        },
        didActive: (val, from) => {
          // self -> didActive  ==> parent => didActive (should Skip)
          if (this.__KeepAlive__.prevKey != null && this.__KeepAlive__.prevKey === val.oldValue) {
            this.__KeepAlive__.prevKey = null
            return
          }

          if (val.newValue === this.__KeepAlive__.uniqKey) {
            this.componentDidActive && this.componentDidActive(val || {})
          }
        }
      }
    }

    componentWillMount(...argvs) {
      super.componentWillMount && super.componentWillMount(...argvs)

      this.__KeepAlive__.uniqKey = this.context.uniqKey
      this.__KeepAlive__.prevKey = this.context.getPrevUniqKey()

      !this.context.disabled &&
        this.__KeepAlive__.events.willActive.call(
          this,
          {
            oldValue: this.__KeepAlive__.prevKey,
            newValue: this.context.uniqKey
          },
          'self'
        )
    }

    componentDidMount(...argvs) {
      super.componentDidMount && super.componentDidMount(...argvs)

      this.__KeepAlive__.prevKey = this.context.getPrevUniqKey()
      !this.context.disabled &&
        this.__KeepAlive__.events.didActive.call(
          this,
          {
            oldValue: this.__KeepAlive__.prevKey,
            newValue: this.context.uniqKey
          },
          'self'
        )

      for (const [name, event] of Object.entries(this.__KeepAlive__.events)) {
        this.context.emitter && this.context.emitter.on(name, event)
      }
    }

    componentWillUnmount(...argvs) {
      super.componentWillUnmount && super.componentWillUnmount(...argvs)

      for (const [name, event] of Object.entries(this.__KeepAlive__.events)) {
        this.context.emitter && this.context.emitter.removeListener(name, event)
      }
    }
  }
}

export type KeepAlivePropsTypes = {
  uniqKey: string
  disabled?: boolean
} & ClassAttributes<KeepAlive>

export type KeepAlivePropsState = {
  components: {}
}

export default class KeepAlive extends React.PureComponent<KeepAlivePropsTypes, KeepAlivePropsState> {
  static propTypes = {
    uniqKey: PropTypes.string.isRequired
  }
  emitter = new EventEmitter()
  static childContextTypes = KeepAliveContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      components: {}
    }

    if (this.props.uniqKey && !this.props.disabled) {
      this.state.components[this.props.uniqKey] = this.props.children
    }
  }

  getChildContext() {
    return {
      getPrevUniqKey: () => this.prevUniqKey,
      disabled: this.props.disabled,
      uniqKey: this.props.uniqKey,
      emitter: this.emitter
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (/*nextProps.uniqKey !== this.props.uniqKey && */ !nextProps.disabled) {
      this.setState({
        components: {
          ...this.state.components,
          [nextProps.uniqKey]: nextProps.children
        }
      })
    }
  }

  prevUniqKey: string

  UNSAFE_componentWillUpdate(next) {
    if (next.uniqKey !== this.props.uniqKey) {
      this.prevUniqKey = this.props.uniqKey
      !this.props.disabled &&
        this.emitter.emit(
          'willUnactive',
          {
            oldValue: this.prevUniqKey,
            newValue: next.uniqKey
          },
          'parent'
        )
      !next.disabled &&
        this.emitter.emit('willActive', {
          oldValue: this.prevUniqKey,
          newValue: next.uniqKey
        })
    }
  }

  componentDidUpdate(prev) {
    if (prev.uniqKey !== this.props.uniqKey) {
      !prev.disabled &&
        this.emitter.emit(
          'didUnactive',
          {
            oldValue: this.prevUniqKey,
            newValue: this.props.uniqKey
          },
          'parent'
        )
      !this.props.disabled &&
        this.emitter.emit(
          'didActive',
          {
            oldValue: this.prevUniqKey,
            newValue: this.props.uniqKey
          },
          'parent'
        )
    }
  }

  // componentDidMount() {
  //   !this.props.disabled &&
  //     this.emitter.emit('didActive', {
  //       // oldValue: prev.uniqKey,
  //       newValue: this.props.uniqKey
  //     }, 'parent')
  // }

  render() {
    const { uniqKey, disabled, children } = this.props
    const { components } = this.state

    const contents = Object.keys(components).map(name => {
      const isActive = name === uniqKey
      return (
        <div
          className={cx(
            'keep-live-core-panel',
            isActive && !disabled ? 'keep-live-core-panel-active' : 'keep-live-core-panel-unactive',
            name && 'keep-live-core-panel-name-' + name
          )}
          key={name}
        >
          {components[name]}
        </div>
      )
    })

    return (
      <>
        {disabled && children}
        {contents}
      </>
    )
  }
}
