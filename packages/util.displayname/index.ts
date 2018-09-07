/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */
import * as React from 'react'
import { IFunction } from '@rcp/_types'
import isComponentClass from '@rcp/util.iscompclass'

export default function displayName(
  component: React.ComponentType | React.ReactElement<any> | IFunction | string
): string {
  if (typeof component === 'string') {
    return component
  }
  if (!component) {
    return String(component)
  }

  const result = (<React.StatelessComponent>component).displayName || (<React.StatelessComponent>component).name
  if (!result) {
    component = <React.ReactElement<any>>component
    return (component.type && displayName(component.type)) || 'Unknown'
  }
  return result
}
