/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'

/**
 * @public
 * @typedef {Object} ValuesHelper
 * @param values {T[]}
 * @param setValues {(values: T[]) => void}
 * @param remove {(value: T) => void}
 * @param add {(value: T) => void}
 * @param toggle {(value: T) => void}
 * @param indexOf {(value: T) => number}
 * @param has {(value: T) => boolean}
 */

/**
 * @public
 * @name useValuesHelper
 * @param stateValues {T[]}
 * @param setValues {(values: T[]) => void}
 * @return {ValuesHelper}
 */
export function useValuesHelper<T = any>(stateValues: T[], setValues: (values: T[]) => void) {
  return React.useMemo(
    () => {
      const indexOf = (value: T) => (!stateValues ? -1 : stateValues!.indexOf(value))
      const has = (value: T) => indexOf(value) >= 0
      const add = (value: T) => {
        if (!has(value)) {
          return setValues((stateValues || []).concat(value))
        }
      }
      const remove = (value: any) => {
        const index = indexOf(value)
        if (index >= 0) {
          const newValues = stateValues!.slice()
          newValues.splice(index, 1)
          return setValues(newValues)
        }
      }
      const toggle = (value: T) => {
        return has(value) ? remove(value) : add(value)
      }
      return {
        values: stateValues,
        setValues,
        remove,
        add,
        toggle,
        indexOf,
        has
      }
    },
    [stateValues, setValues]
  )
}

/**
 * @public
 * @name useValuesState
 * @param values {any[]}
 * @return {ValuesHelper}
 * @example
 * import useValuesState from '@rcp/use.valuesstate'
 *
 * function App() {
 *    const {values, add, remove} = useValuesState([])
 *    return <button onClick={() => add('something')}>Add</button>
 * }
 */
export default function useValuesState<T = any>(values: T[]) {
  const [stateValues, setValues] = React.useState(values)

  return useValuesHelper<T>(stateValues, setValues)
}
