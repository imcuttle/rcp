/**
 * @file index.ts
 * @author imcuttle
 *
 */
import { IDictMap } from '../hoc.i18n/index'
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
export default function useI18n(presetDict: Dictionary, options?: UseI18nOptions): II18nEnv
