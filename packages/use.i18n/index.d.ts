/**
 * @file index.ts
 * @author imcuttle
 *
 */
export declare type Locale = {
  [key: string]: string
}
export declare type Dictionary = {
  [language: string]: Locale
}
export declare type UseI18nOptions = {
  language?: string
  locale?: Locale
}
/**
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
export default function useI18n(
  presetDict: Dictionary,
  options?: UseI18nOptions
): {
  setDictionary(dict: Object, lang?: string): any
  extendDictionary(dict: Object, lang?: string): any
  setLanguage(lang: string): any
}