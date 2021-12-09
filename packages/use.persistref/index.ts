/**
 * @file index.ts
 * @author 余聪
 *
 */

import { useRef } from 'react'

export default function usePersistRef<T>(value: T) {
  const ref = useRef<T>(value)
  ref.current = value

  return ref
}
