import * as React from 'react'

/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */

export interface IFunction extends Function {
  name?: string
}

export type MixComponentClass = React.ComponentClass | React.StatelessComponent
