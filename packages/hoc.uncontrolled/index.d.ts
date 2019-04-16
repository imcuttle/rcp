/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */
/// <reference types="react" />
/**
 * @typedef StrictProp
 * @public
 * @param name {string}
 * @param [withDefault=true] {boolean} - Whether check `default{propKey}` firstly
 * @param [eq=(a, b) => a === b] {Function} - Detect new value and old value is equal
 */
export declare type StrictProp = {
  name: string
  withDefault?: boolean
  eq?: (oldValue: any, newValue: any) => boolean
}
/**
 * @typedef Prop {string | StrictProp}
 * @public
 */
export declare type Prop = string | StrictProp
/**
 *
 * @public
 * @param propList {Prop[]} eg. `['value']` / `[{ name: 'value', withDefault: false }]`
 * @return {Function} `(Component: React.ComponentClass) => React.ComponentClass`
 */
export default function uncontrolled(
  propList?: Prop[]
): (Component: import('react').ComponentClass<{}, any>) => import('react').ComponentClass<{}, any>
