/**
 * @file spec
 * @author 余聪
 * @description
 */
import useCompareEffect from '../'
import { renderHook, act } from '@testing-library/react-hooks'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('useCompareEffect', function () {
  it.skip('should spec', async () => {
    const effectFn = jest.fn(() => {})
    const { waitForNextUpdate, rerender } = renderHook((props) => useCompareEffect(effectFn, props.deps), {
      initialProps: {
        deps: [{ a: 2 }, { b: 3 }]
      }
    })

    // await waitForNextUpdate()
    // expect(effectFn).toHaveBeenCalledTimes(1)

    rerender({
      deps: [{ a: 2 }, { b: 3 }]
    })

    await delay(40)
    expect(effectFn).toHaveBeenCalledTimes(2)
  })
})
