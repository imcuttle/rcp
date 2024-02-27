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
  depsEqual: (aDeps: any[], bDeps: any[]) => boolean = eq,
  { useEffect = React.useEffect }: { useEffect?: typeof React.useEffect } = {}
) {
  var ref = React.useRef(null)
  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps
  }
  useEffect(effect, ref.current)
}
