/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
import * as isPlainObj from 'is-plain-obj'

export function isComponentInstance(instance: any): boolean {
  return !!instance && instance instanceof React.Component
}

// https://discuss.reactjs.org/t/how-to-determine-if-js-object-is-react-component/2825/5
export default function isComponentClass(component: any): boolean {
  return (
    (!!component &&
      !!component.prototype &&
      !!component.prototype.isReactComponent &&
      isPlainObj(component.prototype.isReactComponent)) ||
    // legacy ?
    (!!component && !!component.prototype && isComponentInstance(component.prototype))
  )
}
