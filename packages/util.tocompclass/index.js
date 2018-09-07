'use strict'
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function(d, b) {
      extendStatics(d, b)
      function __() {
        this.constructor = d
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var util_iscompclass_1 = require('@rcp/util.iscompclass')
var util_displayname_1 = require('@rcp/util.displayname')
var React = require('react')
function toComponentClass(component) {
  if (typeof component !== 'function') {
    throw new Error('toComponentClass requires `component` is type of function, but ' + typeof component)
  }
  if (util_iscompclass_1.default(component)) {
    return component
  }
  var StatelessComponent = /** @class */ (function(_super) {
    __extends(StatelessComponent, _super)
    function StatelessComponent() {
      return (_super !== null && _super.apply(this, arguments)) || this
    }
    StatelessComponent.prototype.render = function() {
      return component(this.props)
    }
    StatelessComponent.displayName = util_displayname_1.default(component)
    return StatelessComponent
  })(React.Component)
  Object.assign(StatelessComponent, component)
  return StatelessComponent
}
exports.default = toComponentClass
//# sourceMappingURL=index.js.map
