'use strict'
/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */
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
var util_iscompclass_1 = require('@rcp/util.iscompclass')
var util_displayname_1 = require('@rcp/util.displayname')
var util_createlogger_1 = require('@rcp/util.createlogger')
var logger = util_createlogger_1.default(require('./package.json').name)
function getDefaultName(name) {
  if (name === void 0) {
    name = ''
  }
  return 'default' + name[0].toUpperCase() + name.slice(1)
}
/**
 * 修饰非控制组件，会添加 default${propName} 属性
 * 用于填充 ${propName} 第一次初始化值
 * @param propList {string[]}
 * @param {{withDefault: boolean}}
 * @return {Function}
 */
function uncontrolled(propList, _a) {
  if (propList === void 0) {
    propList = []
  }
  var _b = (_a === void 0 ? {} : _a).withDefault,
    withDefault = _b === void 0 ? true : _b
  logger.invariant(
    Array.isArray(propList) &&
      propList.every(function(x) {
        return typeof x === 'string'
      }),
    '`propList` should be string[], but ' + typeof propList
  )
  return function uncontrolled(Component) {
    var _a
    logger.invariant(util_iscompclass_1.default(Component), '`Component` should be a react component class')
    if (!propList.length) {
      return Component
    }
    return (
      (_a = /** @class */ (function(_super) {
        __extends(Uncontrolled, _super)
        function Uncontrolled(props) {
          var _this = _super.call(this, props) || this
          _this.state = _this.state || {}
          propList.forEach(function(prop) {
            if (withDefault) {
              var defaultPropName = getDefaultName(prop)
              _this.state[prop] =
                typeof _this.props[prop] === 'undefined'
                  ? typeof _this.props[defaultPropName] === 'undefined'
                    ? _this.state[prop]
                    : _this.props[defaultPropName]
                  : _this.props[prop]
            } else {
              if (typeof _this.props[prop] !== 'undefined') {
                _this.state[prop] = _this.props[prop]
              }
            }
          })
          return _this
        }
        Uncontrolled.prototype.componentWillReceiveProps = function(newProps) {
          var _this = this
          if (_super.prototype.componentWillReceiveProps) {
            _super.prototype.componentWillReceiveProps.apply(this, arguments)
          }
          var newState = {}
          var hasNewRecord = false
          propList.forEach(function(prop) {
            if (typeof newProps[prop] !== 'undefined' && _this.state[prop] !== newProps[prop]) {
              newState[prop] = newProps[prop]
              hasNewRecord = true
            }
          })
          if (hasNewRecord) {
            this.setState(newState)
          }
        }
        return Uncontrolled
      })(Component)),
      (_a.displayName = 'Uncontrolled_' + util_displayname_1.default(Component)),
      _a
    )
  }
}
exports.default = uncontrolled
//# sourceMappingURL=index.js.map
