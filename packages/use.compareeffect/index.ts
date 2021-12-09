/**
 * @file index.ts
 * @author 余聪
 *
 */
import { EffectCallback } from 'react'
import * as React from 'react'
import * as eq from 'shallowequal'

export default function useCustomCompareEffect(
  effect: EffectCallback,
  deps: any[],
  depsEqual: (aDeps: any[], bDeps: any[]) => boolean = eq
) {
  var ref = React.useRef(null)
  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps
  }
  React.useEffect(effect, ref.current)
}
