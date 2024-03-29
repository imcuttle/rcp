/**
 * @file index.ts
 * @author 余聪
 *
 */
import * as React from 'react'

export default function useForceUpdate(): [() => void, number] {
  const [v, forceUpdate] = React.useReducer((x: any, a: any) => {
    if (a) {
      return a
    }
    return x + 1
  }, 0)

  // @ts-ignore
  return [forceUpdate, v]
}
