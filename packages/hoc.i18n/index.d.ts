/**
 * @file index.ts
 * @author imcuttle
 *
 */
import { TinyI18n } from 'tiny-i18n';
import { ComponentState } from 'react';
export interface IDictMap {
    [key: string]: string;
}
export interface IDictGroupMap {
    [lang: string]: IDictMap;
}
export interface II18n {
    language?: string;
    dict?: IDictMap | IDictGroupMap;
}
export interface II18nProps {
    language?: string;
    locale?: IDictMap;
}
export interface II18nComponent<P = II18nProps, S = any> extends React.Component {
    i: Function;
    readonly props: P;
}
export interface II18nComponentClass<P = II18nProps, S = ComponentState> extends React.ComponentClass {
    new (props: P, context?: any): II18nComponent<P, S>;
    i18n: TinyI18n;
}
export interface II18nOptions {
    tinyI18n?: TinyI18n;
    localeKey?: string;
    languageKey?: string;
}
/**
 *
 * @param {IDictMap | IDictGroupMap} dict
 * @param {string} language
 * @param {string} localeKey
 * @param {string} languageKey
 * @param {string} tinyI18n
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
export default function i18n<P = II18nProps, S = any>(dict?: IDictMap | IDictGroupMap, language?: string, { tinyI18n, localeKey, languageKey }?: II18nOptions): (Component: import("react").ComponentClass<{}, any>) => II18nComponentClass<II18nProps & P, S>;
