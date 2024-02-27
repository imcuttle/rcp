/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */
/**
 * @typedef StrictProp
 * @public
 * @param name {string}
 * @param [withDefault=true] {boolean} - Whether check `default{propKey}` firstly
 * @param [eq=(a, b) => a === b] {Function} - Detect new value and old value is equal
 */
export type StrictProp = {
  name: string
  withDefault?: boolean
  eq?: (oldValue: any, newValue: any) => boolean
}
/**
 * @typedef Prop {string | StrictProp}
 * @public
 */
export type Prop = string | StrictProp
/**
 *
 * @public
 * @param propList {Prop[]} eg. `['value']` / `[{ name: 'value', withDefault: false, eq: (a, b) => a === b }]`
 * @return {Function} `(Component: React.ComponentClass) => React.ComponentClass`
 */
export default function uncontrolled(propList?: Prop[]): (Component: React.ComponentClass) => React.ComponentClass
