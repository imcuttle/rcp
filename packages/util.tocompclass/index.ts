/**
 * @file index.ts
 * @author imcuttle
 *
 */
import isComponentClass from '@rcp/util.iscompclass'
import displayName from '@rcp/util.displayname'
import { MixComponentClass } from '@rcp/_types'
import * as React from 'react'

export default function toComponentClass(component: MixComponentClass | Function): React.ComponentClass {
  if (typeof component !== 'function') {
    throw new Error('toComponentClass requires `component` is type of function, but ' + typeof component)
  }

  if (isComponentClass(component)) {
    return <React.ComponentClass>component
  }

  return class StatelessComponent extends React.Component {
    static displayName = displayName(component)
    render() {
      return (<Function>component)(this.props)
    }
  }
}
