import useUncontrolled from '..'
import * as TestRenderer from 'react-test-renderer'
import { renderHook, act } from '@testing-library/react-hooks'
import * as React from 'react'

describe('useUncontrolled', () => {
  const Test = React.forwardRef(({ value, defaultValue, onChange }: any, ref) => {
    const [stateValue, setValue] = useUncontrolled({ value, defaultValue, onChange })
    React.useImperativeHandle(
      ref,
      () => {
        return {
          stateValue,
          setValue
        }
      },
      [stateValue, setValue]
    )

    return stateValue
  })

  it('value / props sync', () => {
    const ref = React.createRef<any>()
    const onChange = jest.fn(() => {})
    const testRenderer = TestRenderer.create(<Test ref={ref} onChange={onChange} defaultValue={1} />)

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`"1"`)
    expect(ref.current.stateValue).toMatchInlineSnapshot(`1`)
    expect(onChange).not.toBeCalled()

    // update state inner
    act(() => {
      ref.current.setValue(2)
    })
    expect(onChange).toBeCalledWith(2)
    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`"2"`)
    expect(ref.current.stateValue).toMatchInlineSnapshot(`2`)

    // update state
    testRenderer.update(<Test ref={ref} onChange={onChange} value={3} />)
    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`"3"`)
    expect(ref.current.stateValue).toMatchInlineSnapshot(`3`)
    expect(onChange).toBeCalledWith(3)
  })

  it('should do not call onChange firstly', function() {
    const onChange = jest.fn(() => {})
    const testRenderer = TestRenderer.create(<Test onChange={onChange} value={1} />)
    expect(onChange).not.toBeCalled()

    testRenderer.update(<Test onChange={onChange} value={1} />)
    expect(onChange).not.toBeCalled()

    testRenderer.update(<Test onChange={onChange} value={2} />)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
