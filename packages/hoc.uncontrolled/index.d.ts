/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */
/// <reference types="react" />
/**
 *
 * @public
 * @param propList {string[]} eg. `['value']`
 * @param {{}} options
 * @param {boolean} [options.withDefault = true] - Whether check `default{propKey}` firstly
 * @return {Function} `(Component: React.ComponentClass) => React.ComponentClass`
 */
export default function uncontrolled(
  propList?: any[],
  {
    withDefault
  }?: {
    withDefault?: boolean
  }
): (Component: import('react').ComponentClass<{}, any>) => import('react').ComponentClass<{}, any>
