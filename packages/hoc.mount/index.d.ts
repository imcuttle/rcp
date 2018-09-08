/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
interface IHocMountOptions {
  mountNodeGetter?: (props: any) => Node
  attributesGetter?: (props: any) => any
  createTimeType?: 'decorator' | 'class' | 'component'
}
/**
 * @public
 * @param opts {{}}
 * @param {"decorator" | "class" | "component"} [opts.createTimeType = 'class']
 * @param {() => HTMLElement} [opts.mountNodeGetter = () => document.body]
 * @param {() => any} [opts.attributesGetter = () => {}]
 * @return {<P>(Component: React.ComponentType) => React.ComponentClass<P>}
 */
export default function mountHOC({
  createTimeType,
  mountNodeGetter,
  attributesGetter
}?: IHocMountOptions): <P = any>(Component: React.ComponentType<{}>) => React.ComponentClass<P, any>
export {}
