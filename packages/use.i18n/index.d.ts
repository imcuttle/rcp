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
export default function useI18n(presetDict: Dictionary, { language, locale }?: UseI18nOptions): any
