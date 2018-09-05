/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 *
 */

import { displayName } from 'util-display-name'
import { invariant } from './'
import { createIsolateI18n } from 'tiny-i18n'
import eI18n from '@befe/utils/i18n/easy-i18n'
import { each } from 'lodash'
import * as PropTypes from 'prop-types'

const currentLang = eI18n.getLang().lang

function initI18n({ language, dict } = {}) {
  const { setDictionary, extendDictionary, setLanguage, i18n } = this
  if (language && typeof language === 'string') {
    setLanguage(language)
  }
  if (dict) {
    each(dict, function(dict, lang) {
      // 设置默认语言的字典
      if (typeof dict === 'string') {
        // lang 当成 key
        extendDictionary({ [lang]: dict })
        return
      }

      setDictionary(dict, lang)
    })
  }
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
export default function i18n(dict = {}, language = currentLang) {
  return function(Component) {
    Component.i18n = createIsolateI18n()

    // 默认字典
    initI18n.call(Component.i18n, {
      dict,
      language
    })

    return class I18nComponent extends Component {
      static displayName = displayName(Component)
      static propTypes = {
        locale: PropTypes.object,
        ...Component.propTypes
      }

      i(key, ...argv) {
        invariant(this.constructor.i18n && typeof this.constructor.i18n.i18n === 'function', `未找到 i18n 注入`)

        const { i18n, getDictionary } = this.constructor.i18n

        if (this.props.locale) {
          const tmp = createIsolateI18n()
          const currDict = getDictionary()
          tmp.extendDictionary(currDict)
          tmp.extendDictionary(this.props.locale)
          return tmp.i18n.apply(null, arguments)
        }

        return i18n.apply(null, arguments)
      }
    }
  }
}
