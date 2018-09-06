/**
 * @file index.ts
 * @author imcuttle
 *
 */

import displayName from '@rcp/util.displayname'
import createLogger from '@rcp/util.createlogger'
import { createIsolateI18n } from 'tiny-i18n'
import * as each from 'lodash.foreach'
import * as PropTypes from 'prop-types'
import { ComponentState, ReactNode } from 'react'

const horn = createLogger(require('./package.json').name)

export interface IDictMap {
  [key: string]: string
}

export interface IDictGroupMap {
  [lang: string]: IDictMap
}

export interface II18n {
  language?: string
  dict?: IDictMap | IDictGroupMap
}
function initI18n({ language, dict }: II18n = {}) {
  const { setDictionary, extendDictionary, setLanguage, i18n } = this
  if (language && typeof language === 'string') {
    setLanguage(language)
  }

  if (dict) {
    each(dict, function(words, lang) {
      // 设置默认语言的字典
      if (typeof words === 'string') {
        // lang 当成 key
        extendDictionary({ [lang]: words })
        return
      }

      setDictionary(words, lang)
    })
  }
}

export interface II18nProps {
  language?: string
  locale?: IDictMap
}
export interface II18nComponent<P = II18nProps, S = any> extends React.Component {
  i: Function
  readonly props: P
}
export interface II18nComponentClass<P = II18nProps, S = ComponentState> extends React.ComponentClass {
  new (props: P, context?: any): II18nComponent<P, S>
  i18n: II18nEnv
}

/**
 * i18n: i18n,
 setDictionary: setDictionary,
 setLanguage: setLanguage,
 getCurrentLanguage: getCurrentLanguage,
 getDictionary: getDictionary,
 getLanguages: getLanguages,
 getWord: getWord,
 extendDictionary: extendDictionary
 */
export interface II18nEnv {
  i18n: (key: string, ...argv: any[]) => string
  setDictionary: (dict: IDictMap, language?: string) => void
  setLanguage: (language: string) => void
  getCurrentLanguage: () => string
  getDictionary: (language?: string) => IDictMap
  getLanguages: () => string[]
  getWord: (key: string, language?: string) => string
  extendDictionary: (dict: IDictMap, language?: string) => void
}

/**
 * 设置组件国际化
 * @param dict {{}}
 * @param [language] {string}
 * @return {function}
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
export default function i18n<P = II18nProps, S = any>(dict?: IDictMap | IDictGroupMap, language?: string) {
  return function(Component: React.ComponentClass): II18nComponentClass<II18nProps & P, S> {
    // todo
    // @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/recompose/index.d.ts
    // @see https://www.zhihu.com/question/279911703
    // @i18n in ts
    class I18nComponent extends Component implements II18nComponent<II18nProps & P, S> {
      readonly props: II18nProps & P
      static i18n: II18nEnv = createIsolateI18n()
      static displayName = displayName(Component)
      static propTypes = {
        locale: PropTypes.objectOf(PropTypes.string),
        language: PropTypes.string,
        ...Component.propTypes
      }
      // static defaultProps = {}

      public i(key, ...argv) {
        const constructor = <II18nComponentClass>this.constructor
        horn.invariant(
          constructor.i18n && typeof constructor.i18n.i18n === 'function',
          'i18n is not found in ' + displayName(this.constructor)
        )

        const { i18n, getDictionary, setLanguage } = constructor.i18n
        if (this.props.locale) {
          const tmp: II18nEnv = createIsolateI18n()
          let lang = typeof this.props.language === 'string' ? this.props.language : undefined
          const currDict = getDictionary(lang)
          tmp.extendDictionary(currDict)

          tmp.extendDictionary(this.props.locale)
          return tmp.i18n.apply(null, arguments)
        }

        if (typeof this.props.language === 'string') {
          const lang = this.props.language
          const tmp: II18nEnv = createIsolateI18n()
          const langDict = getDictionary(lang)
          tmp.extendDictionary(langDict, lang)
          tmp.setLanguage(lang)
          return tmp.i18n.apply(null, arguments)
        }
        return i18n.apply(null, arguments)
      }
    }

    // 默认字典
    initI18n.call(I18nComponent.i18n, {
      dict,
      language
    })
    return I18nComponent
  }
}
