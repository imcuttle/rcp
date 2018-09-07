'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function displayName(component) {
  if (typeof component === 'string') {
    return component
  }
  if (!component) {
    return String(component)
  }
  var result = component.displayName || component.name
  if (!result) {
    component = component
    return (component.type && displayName(component.type)) || 'Unknown'
  }
  return result
}
exports.default = displayName
//# sourceMappingURL=index.js.map
