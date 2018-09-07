'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var ReactDOM = require('react-dom')
/**
 *
 * @param {IMountOptions<P>} centerOpts
 * @return {IMountCenter}
 */
function createMountCenter(centerOpts) {
  if (centerOpts === void 0) {
    centerOpts = {}
  }
  centerOpts = Object.assign(
    {
      mountNode: document.body
    },
    centerOpts
  )
  var container = null
  function getContainer(attrs, mNode) {
    if (attrs === void 0) {
      attrs = centerOpts.attributes
    }
    if (mNode === void 0) {
      mNode = centerOpts.mountNode
    }
    if (!container) {
      container = document.createElement('div')
      mNode.appendChild(container)
    }
    return Object.assign(container, attrs)
  }
  return {
    close: function() {
      var dom = getContainer()
      ReactDOM.unmountComponentAtNode(dom)
      dom.parentNode.removeChild(dom)
      container = null
    },
    open: function(_a) {
      var _b = _a === void 0 ? {} : _a,
        _c = _b.element,
        element = _c === void 0 ? centerOpts.element : _c,
        _d = _b.mountNode,
        mountNode = _d === void 0 ? centerOpts.mountNode : _d,
        _e = _b.attributes,
        attributes = _e === void 0 ? centerOpts.attributes : _e
      var dom = getContainer(attributes, mountNode)
      ReactDOM.render(element, dom)
      return dom
    }
  }
}
exports.default = createMountCenter
//# sourceMappingURL=index.js.map
