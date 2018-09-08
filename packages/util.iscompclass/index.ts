/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
import * as isPlainObj from 'is-plain-obj'

/**
 * Determine react component instance
 * @public
 * @param instance {any}
 * @return {boolean}
 * @example
 * import { isComponentInstance } from '@rcp/util.iscompclass'
 * class View extends React.Component {}
 *
 * isComponentInstance(View.prototype)
 */
export function isComponentInstance(instance: any): boolean {
  return !!instance && instance instanceof React.Component
}

/**
 * Determine react component class
 * @public
 * @see [how-to-determine-if-js-object-is-react-component](https://discuss.reactjs.org/t/how-to-determine-if-js-object-is-react-component/2825/5)
 * @param component {any}
 * @return {boolean}
 */
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
