/**
 * @file index.ts
 * @author imcuttle
 *
 */
import { ComponentState } from 'react'
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
export interface II18nOptions {
  localeKey?: string
  languageKey?: string
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
export default function i18n<P = II18nProps, S = any>(
  dict?: IDictMap | IDictGroupMap,
  language?: string,
  { localeKey, languageKey }?: II18nOptions
): (Component: import('react').ComponentClass<{}, any>) => II18nComponentClass<II18nProps & P, S>
