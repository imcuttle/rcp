/**
 * @file index.ts
 * @author 余聪
 *
 */
import React, { EffectCallback } from 'react'
import eq from 'shallowequal'

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
