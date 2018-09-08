/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'

/**
 * Determinate the input is element of the component class
 * @public
 * @param {React.ComponentType} Component
 * @return {(element: React.ReactElement<any>) => boolean}
 */
export default function isElementOf(Component: React.ComponentType) {
  // Trying to solve the problem with 'children: XXX.isRequired'
  // (https://github.com/gaearon/react-hot-loader/issues/710). This does not work for me :(
  const originalPropTypes = Component.propTypes
  Component.propTypes = void 0

  // Well known workaround
  const elementType = React.createElement(Component).type

  // Restore originalPropTypes
  Component.propTypes = originalPropTypes

  return (element: React.ReactElement<any>) => !!element && element.type === elementType
}
