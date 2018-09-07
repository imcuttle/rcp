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
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {}
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]]
    return t
  }
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var React = require('react')
var util_displayname_1 = require('@rcp/util.displayname')
var util_createlogger_1 = require('@rcp/util.createlogger')
var util_createmount_1 = require('@rcp/util.createmount')
var util_tocompclass_1 = require('@rcp/util.tocompclass')
var log = util_createlogger_1.default(require('./package.json').name)
function mountHOC(_a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.createTimeType,
    createTimeType = _c === void 0 ? 'class' : _c,
    _d = _b.mountNodeGetter,
    mountNodeGetter =
      _d === void 0
        ? function() {
            return document.body
          }
        : _d,
    _e = _b.attributesGetter,
    attributesGetter = _e === void 0 ? function() {} : _e
  var center
  if (createTimeType === 'decorator') {
    center = util_createmount_1.default()
  }
  return function(Component) {
    var _a
    log.invariant(typeof Component === 'function', '`Component` should be an function, but ' + typeof Component)
    Component = util_tocompclass_1.default(Component)
    var classCenter = center
    if (createTimeType === 'class') {
      classCenter = util_createmount_1.default()
    }
    return (
      (_a = /** @class */ (function(_super) {
        __extends(Mount, _super)
        function Mount(props, context) {
          var _this = _super.call(this, props, context) || this
          var compCenter = classCenter
          if (createTimeType === 'component') {
            compCenter = util_createmount_1.default()
          }
          _this.center = compCenter
          return _this
        }
        Object.defineProperty(Mount.prototype, 'attributes', {
          get: function() {
            return attributesGetter(this.props)
          },
          enumerable: true,
          configurable: true
        })
        Object.defineProperty(Mount.prototype, 'mountNode', {
          get: function() {
            return mountNodeGetter(this.props)
          },
          enumerable: true,
          configurable: true
        })
        Mount.prototype.componentDidMount = function() {
          this.center.open({
            element: this.element,
            attributes: this.attributes,
            mountNode: this.mountNode
          })
        }
        Mount.prototype.componentDidUpdate = function() {
          this.center.open({
            element: this.element,
            attributes: this.attributes,
            // unused
            mountNode: this.mountNode
          })
        }
        Mount.prototype.componentWillUnmount = function() {
          this.center.close()
        }
        Object.defineProperty(Mount.prototype, 'element', {
          get: function() {
            var _this = this
            var iProps = this.props
            var children = iProps.children,
              props = __rest(iProps, ['children'])
            return React.createElement(
              Component,
              __assign({}, props, {
                ref: function(ref) {
                  return (_this.originRef = ref)
                }
              }),
              children
            )
          },
          enumerable: true,
          configurable: true
        })
        Mount.prototype.render = function() {
          return null
        }
        return Mount
      })(React.Component)),
      (_a.displayName = 'Mount_' + util_displayname_1.default(Component)),
      _a
    )
  }
}
exports.default = mountHOC
//# sourceMappingURL=index.js.map
