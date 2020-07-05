/**
 * @file index.ts
 * @author imcuttle
 *
 */

import * as React from 'react'
import { createIsolateI18n, TinyI18n, Dictionary, Locale } from 'tiny-i18n'

export { Dictionary, Locale }

export type UseI18nOptions = {
  tinyI18n?: TinyI18n
  language?: string
  locale?: Locale
}

/**
 * @public
 * @param presetDict {{}}
 * @param options
 * @param [options.language] {string}
 * @param [options.locale] {{}}
 * @example
 * useI18n({
 *   zh: { name: '姓名' },
 *   en: { name: 'Name' },
 * }, { language: 'zh' })
 * @example
 * useI18n({
 *   zh: { name: '姓名' },
 *   en: { name: 'Name' },
 * }, { locale: {name: 'Customized Name'} })
 */
export default function useI18nCore(presetDict: Dictionary, options: UseI18nOptions = {}): TinyI18n {
  const { language, locale = {}, tinyI18n } = options
  const i18n = React.useMemo<TinyI18n>(
    () => {
      const i18n = tinyI18n || createIsolateI18n()
      for (const [lang, dict] of Object.entries(presetDict)) {
        i18n.extendDictionary(dict, lang)
      }
      return i18n
    },
    [tinyI18n]
  )

  // 先设置语言
  React.useMemo(
    () => {
      language && i18n.setLanguage(language)
      locale && Object.keys(locale).length && i18n.extendDictionary(locale)
    },
    [language, locale, i18n]
  )

  return i18n
}
