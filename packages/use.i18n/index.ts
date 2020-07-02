/**
 * @file index.ts
 * @author imcuttle
 *
 */

import * as React from 'react'
import { createIsolateI18n } from 'tiny-i18n'

export type Locale = {
  [key: string]: string
}

export type Dictionary = {
  [language: string]: Locale
}

export interface II18nEnv {
  i18n: (key: string, ...argv: any[]) => string
  setDictionary: (dict: Locale, language?: string) => void
  setLanguage: (language: string) => void
  getCurrentLanguage: () => string
  getDictionary: (language?: string) => Locale
  getLanguages: () => string[]
  getWord: (key: string, language?: string) => string
  extendDictionary: (dict: Locale, language?: string) => void
}

export type UseI18nOptions = {
  tinyI18n?: II18nEnv
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
export default function useI18nCore(presetDict: Dictionary, options: UseI18nOptions = {}): II18nEnv {
  const { language, locale = {}, tinyI18n } = options
  const i18n = React.useMemo<II18nEnv>(
    () => {
      const i18n = tinyI18n || createIsolateI18n()
      for (const [lang, dict] of Object.entries(presetDict)) {
        i18n.setDictionary(dict, lang)
      }
      return i18n as II18nEnv
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
