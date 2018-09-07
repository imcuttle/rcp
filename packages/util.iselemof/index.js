'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var React = require('React')
function isElementOf(Component) {
  // Trying to solve the problem with 'children: XXX.isRequired'
  // (https://github.com/gaearon/react-hot-loader/issues/710). This does not work for me :(
  var originalPropTypes = Component.propTypes
  Component.propTypes = void 0
  // Well known workaround
  var elementType = React.createElement(Component).type
  // Restore originalPropTypes
  Component.propTypes = originalPropTypes
  return function(element) {
    return !!element && element.type === elementType
  }
}
exports.default = isElementOf
//# sourceMappingURL=index.js.map
