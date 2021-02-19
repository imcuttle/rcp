/**
 * @file index.ts
 * @author imcuttle
 *
 */

import * as React from 'react'

const defaultEq = (a, b) => a === b

export function useUncontrolledCore<T = any>(
  propValue?: T,
  {
    initialValue = propValue,
    useEffect = React.useLayoutEffect,
    eq = defaultEq,
    onChange
  }: {
    eq?: (a: T, b: T) => boolean
    initialValue?: T
    useEffect?: typeof React.useEffect
    onChange?: (value: T) => void
  } = {}
): [T | undefined, (newValue: ((value: T) => T) | T) => void] {
  const [value, setStateValue] = React.useState(initialValue)
  const setValueFinal = React.useCallback(
    (newValue: Function | boolean | any) => {
      if (typeof newValue === 'function') {
        newValue = newValue(value)
      }
      if (eq(value, newValue)) {
        return
      }
      setStateValue(newValue)
      onChange && onChange(newValue)
    },
    [value, eq, onChange, setStateValue]
  )

  const fnRef = React.useRef(setValueFinal)
  fnRef.current = setValueFinal

  useEffect(
    () => {
      if (typeof propValue !== 'undefined') {
        fnRef.current(propValue)
      }
    },
    [propValue]
  )

  return [value, setValueFinal]
}

/**
 * @public
 * @name useUncontrolled
 * @param [value] {T} - Piped value
 * @param [defaultValue] {T} - Initialize value firstly
 * @param [onChange] {(value: T) => void} - Bind `onChange` handler when value updating
 * @param [useEffect] {typeof React.useLayoutEffect}
 * @param [eq] {(a: T, b: T) => boolean}
 * @returns {Array} `[T, ((value: T) => T | T) => void]`
 * @example
 * function Input({value, onChangeValue, defaultValue}) {
 *   const [valueState, setValue] = useUncontrolled({value, onChange: onChangeValue, defaultValue})
 *
 *   return <input type='text' value={valueState} onChange={evt => setValue(evt.target.value)} />
 * }
 */
export default function useUncontrolled<T = any>({
  value,
  defaultValue,
  onChange,
  useEffect = React.useLayoutEffect,
  eq
}: {
  useEffect?: typeof React.useEffect
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  eq?: (a: T, b: T) => boolean
}) {
  let initialValue = value
  if (defaultValue) {
    initialValue = typeof value === 'undefined' ? defaultValue : value
  }

  return useUncontrolledCore<T>(value, {
    eq,
    initialValue,
    useEffect,
    onChange
  })
}
