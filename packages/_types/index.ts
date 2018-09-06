import * as React from 'react'

export interface IFunction extends Function {
  name?: string
}

export type MixComponentClass = React.ComponentClass | React.StatelessComponent
