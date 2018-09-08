/**
 * @file index.ts
 * @author imcuttle
 *
 */
import isComponentClass from '@rcp/util.iscompclass'
import displayName from '@rcp/util.displayname'
import * as React from 'react'

/**
 * Convert stateless component class to be component class
 * @public
 * @param {React.ComponentType} component
 * @return {React.ComponentClass<P, S>}
 */
export default function toComponentClass<P = any, S = any>(component: React.ComponentType): React.ComponentClass<P, S> {
  if (typeof component !== 'function') {
    throw new Error('toComponentClass requires `component` is type of function, but ' + typeof component)
  }

  if (isComponentClass(component)) {
    return <React.ComponentClass<P, S>>component
  }

  class StatelessComponent extends React.Component<P, S> {
    static displayName = displayName(component)
    render() {
      return (<React.StatelessComponent>component)(this.props)
    }
  }
  Object.assign(StatelessComponent, component)
  return StatelessComponent
}
