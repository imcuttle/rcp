/**
 * @file index.ts
 * @author imcuttle
 *
 */
import { TinyI18n, Dictionary, Locale } from 'tiny-i18n'
export { Dictionary, Locale }
export declare type UseI18nOptions = {
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
export default function useI18nCore(presetDict: Dictionary, options?: UseI18nOptions): TinyI18n
