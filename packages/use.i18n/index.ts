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

export type UseI18nOptions = {
  language?: string
  locale?: Locale
}

export default function useI18n(presetDict: Dictionary, { language, locale = {} }: UseI18nOptions = {}) {
  const i18n = React.useMemo(() => {
    const i18n = createIsolateI18n()
    for (const [lang, dict] of Object.entries(presetDict)) {
      i18n.setDictionary(dict, lang)
    }
    return i18n
  }, [])

  // 先设置语言
  React.useMemo(
    () => {
      language && i18n.setLanguage(language)
      locale && i18n.extendDictionary(locale)
    },
    [language, locale, i18n]
  )

  return i18n
}
