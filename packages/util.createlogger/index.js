'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file index.ts
 * @author imcuttle
 *
 */
var u = require('util')
var d = require('debug')
function createLogger(namespace) {
  if (namespace === void 0) {
    namespace = ''
  }
  function invariant(check, message) {
    if (message === void 0) {
      message = ''
    }
    if (!check) {
      throw new Error(format({ message: message }))
    }
  }
  var debug = d(namespace)
  var str = namespace !== '' ? '(' + namespace + ')' : namespace
  function format(_a) {
    var _b = _a === void 0 ? {} : _a,
      _c = _b.message,
      message = _c === void 0 ? '' : _c,
      _d = _b.type,
      type = _d === void 0 ? '' : _d,
      _e = _b.argv,
      argv = _e === void 0 ? [] : _e
    message = u.format.apply(u, [message].concat(argv))
    return '' + type + str + ': ' + message
  }
  function log(message) {
    var argv = []
    for (var _i = 1; _i < arguments.length; _i++) {
      argv[_i - 1] = arguments[_i]
    }
    console.log(format({ message: message, argv: argv, type: '' }))
  }
  function warn(message) {
    var argv = []
    for (var _i = 1; _i < arguments.length; _i++) {
      argv[_i - 1] = arguments[_i]
    }
    console.warn(format({ message: message, argv: argv, type: 'Warning' }))
  }
  function error(message) {
    var argv = []
    for (var _i = 1; _i < arguments.length; _i++) {
      argv[_i - 1] = arguments[_i]
    }
    console.error(format({ message: message, argv: argv, type: 'Error' }))
  }
  return {
    invariant: invariant,
    format: format,
    log: log,
    warn: warn,
    debug: debug,
    error: error
  }
}
exports.default = createLogger
//# sourceMappingURL=index.js.map
