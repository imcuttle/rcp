/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */
import * as React from 'react'
import { IFunction } from '@rcp/_internal-types'

type MixComponentClass = React.ComponentClass | React.StatelessComponent
export default function displayName<T>(
  component: MixComponentClass | React.ReactElement<T> | IFunction | string
): string {
  if (typeof component === 'string') {
    return component
  }
  if (!component) {
    return String(component)
  }
  const result = (<MixComponentClass>component).displayName || (<IFunction>component).name
  if (!result) {
    component = <React.ReactElement<T>>component
    return (component.type && displayName(component.type)) || 'Unknown'
  }
}
