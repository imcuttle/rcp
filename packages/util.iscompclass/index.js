'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var React = require('React')
var isPlainObj = require('is-plain-obj')
function isComponentInstance(instance) {
  return !!instance && instance instanceof React.Component
}
exports.isComponentInstance = isComponentInstance
// https://discuss.reactjs.org/t/how-to-determine-if-js-object-is-react-component/2825/5
function isComponentClass(component) {
  return (
    (!!component &&
      !!component.prototype &&
      !!component.prototype.isReactComponent &&
      isPlainObj(component.prototype.isReactComponent)) ||
    // legacy ?
    (!!component && !!component.prototype && isComponentInstance(component.prototype))
  )
}
exports.default = isComponentClass
//# sourceMappingURL=index.js.map
