/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
import displayName from '@rcp/util.displayname'
import createLogger from '@rcp/util.createlogger'
import createMount, { IMountOptions } from '@rcp/util.createmount'
import toComponentClass from '@rcp/util.tocompclass'
import { createRef, Ref } from 'react'
import { IMountCenter } from '../util.createmount'

const log = createLogger(require('./package.json').name)

interface IHocMountOptions {
  mountNodeGetter?: (props: any) => Node
  attributesGetter?: (props: any) => any
  createTimeType?: 'decorator' | 'class' | 'component'
}

export default function mountHOC({
  createTimeType = 'class',
  mountNodeGetter = () => document.body,
  attributesGetter = () => {}
}: IHocMountOptions = {}): <P>(Component: React.ComponentType) => React.ComponentClass<P> {
  let center
  if (createTimeType === 'decorator') {
    center = createMount()
  }
  return function<P = any>(Component: React.ComponentType) {
    log.invariant(typeof Component === 'function', `\`Component\` should be an function, but ${typeof Component}`)
    Component = toComponentClass<{ ref: any }>(Component)

    let classCenter = center
    if (createTimeType === 'class') {
      classCenter = createMount()
    }
    return class Mount extends React.Component<P> {
      static displayName = `Mount_${displayName(Component)}`

      get attributes() {
        return attributesGetter(this.props)
      }

      get mountNode() {
        return mountNodeGetter(this.props)
      }

      constructor(props, context) {
        super(props, context)
        let compCenter = classCenter
        if (createTimeType === 'component') {
          compCenter = createMount()
        }
        this.center = compCenter
      }

      public center: IMountCenter

      componentDidMount() {
        this.center.open({
          element: this.element,
          attributes: this.attributes,
          mountNode: this.mountNode
        })
      }

      componentDidUpdate() {
        this.center.open({
          element: this.element,
          attributes: this.attributes,
          // unused
          mountNode: this.mountNode
        })
      }

      componentWillUnmount() {
        this.center.close()
      }

      public originRef: React.Component

      get element() {
        const iProps: any = this.props
        const { children, ...props } = iProps
        return (
          <Component {...props} ref={ref => (this.originRef = ref)}>
            {children}
          </Component>
        )
      }

      render() {
        return null
      }
    }
  }
}
