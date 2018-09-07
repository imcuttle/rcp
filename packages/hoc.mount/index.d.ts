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
export default function mountHOC({
  createTimeType,
  mountNodeGetter,
  attributesGetter
}?: IHocMountOptions): <P>(Component: React.ComponentType) => React.ComponentClass<P>
export {}
