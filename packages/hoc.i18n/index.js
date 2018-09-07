'use strict'
/**
 * @file index.ts
 * @author imcuttle
 *
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
Object.defineProperty(exports, '__esModule', { value: true })
var util_displayname_1 = require('@rcp/util.displayname')
var util_createlogger_1 = require('@rcp/util.createlogger')
var util_iscompclass_1 = require('@rcp/util.iscompclass')
var tiny_i18n_1 = require('tiny-i18n')
var each = require('lodash.foreach')
var PropTypes = require('prop-types')
var horn = util_createlogger_1.default(require('./package.json').name)
function initI18n(_a) {
  var _b = _a === void 0 ? {} : _a,
    language = _b.language,
    dict = _b.dict
  var _c = this,
    setDictionary = _c.setDictionary,
    extendDictionary = _c.extendDictionary,
    setLanguage = _c.setLanguage,
    i18n = _c.i18n
  if (language && typeof language === 'string') {
    setLanguage(language)
  }
  if (dict) {
    each(dict, function(words, lang) {
      var _a
      // 设置默认语言的字典
      if (typeof words === 'string') {
        // lang 当成 key
        extendDictionary(((_a = {}), (_a[lang] = words), _a))
        return
      }
      setDictionary(words, lang)
    })
  }
}
/**
 *
 * @param {IDictMap | IDictGroupMap} dict
 * @param {string} language
 * @param {string} localeKey
 * @param {string} languageKey
 * @return {(Component: React.ComponentClass) => II18nComponentClass<II18nProps & P, S>}
 * @example
 * \@i18n({
 *   zh-cn: {
 *      hello: '你好'
 *   },
 *   en-us: {
 *      hello: 'Hello'
 *   }
 * })
 * class Comp extends React.Component {
 *    render() {
 *      return this.i('hello')
 *    }
 * }
 */
function i18n(dict, language, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.localeKey,
    localeKey = _c === void 0 ? 'locale' : _c,
    _d = _b.languageKey,
    languageKey = _d === void 0 ? 'language' : _d
  return function(Component) {
    var _a
    horn.invariant(
      util_iscompclass_1.default(Component),
      '`Component` should be a React ComponentClass. but typeof ' + typeof Component
    )
    // todo  typescript decorator syntax
    // @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/recompose/index.d.ts
    // @see https://www.zhihu.com/question/279911703
    // @i18n in ts
    var i18nEnv = tiny_i18n_1.createIsolateI18n()
    initI18n.call(i18nEnv, {
      dict: dict,
      language: language
    })
    var I18nComponent = /** @class */ (function(_super) {
      __extends(I18nComponent, _super)
      function I18nComponent() {
        return (_super !== null && _super.apply(this, arguments)) || this
      }
      I18nComponent.prototype.i = function(key) {
        var argv = []
        for (var _i = 1; _i < arguments.length; _i++) {
          argv[_i - 1] = arguments[_i]
        }
        var constructor = this.constructor
        horn.invariant(
          constructor.i18n && typeof constructor.i18n.i18n === 'function',
          'i18n is not found in ' + util_displayname_1.default(this.constructor)
        )
        var language = this.props[languageKey]
        var locale = this.props[localeKey]
        var _a = constructor.i18n,
          i18n = _a.i18n,
          getDictionary = _a.getDictionary,
          setLanguage = _a.setLanguage
        if (locale) {
          var tmp = tiny_i18n_1.createIsolateI18n()
          var lang = typeof language === 'string' ? language : undefined
          var currDict = getDictionary(lang)
          tmp.extendDictionary(currDict)
          tmp.extendDictionary(locale)
          return tmp.i18n.apply(null, arguments)
        }
        if (typeof language === 'string') {
          var tmp = tiny_i18n_1.createIsolateI18n()
          var langDict = getDictionary(language)
          tmp.extendDictionary(langDict, language)
          tmp.setLanguage(language)
          return tmp.i18n.apply(null, arguments)
        }
        return i18n.apply(null, arguments)
      }
      I18nComponent.i18n = i18nEnv
      I18nComponent.displayName = 'I18n_' + util_displayname_1.default(Component)
      I18nComponent.propTypes = __assign(
        ((_a = {}), (_a[localeKey] = PropTypes.objectOf(PropTypes.string)), (_a[languageKey] = PropTypes.string), _a),
        Component.propTypes
      )
      return I18nComponent
    })(Component)
    return I18nComponent
  }
}
exports.default = i18n
//# sourceMappingURL=index.js.map
