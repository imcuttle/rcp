/**
 * @file spec
 * @author 余聪
 * @description
 */
import { usePreventFastOperation } from '../'
import { renderHook, act } from '@testing-library/react-hooks'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

describe('usePreventFastOperation', function () {
  it('should spec', async () => {
    const fn = jest.fn(async () => {
      await delay(1000)
    })
    const { result, waitForNextUpdate } = renderHook(() => usePreventFastOperation({ onOperation: fn }))
    const [gn] = result.current
    expect(fn).toHaveBeenCalledTimes(0)
    expect(result.current[1].loading).toBeFalsy()

    const p = act(() =>
      gn().then(() => {
        expect(fn).toHaveBeenCalledTimes(1)
      })
    )
    act(() => {
      gn()
    })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(result.current[1].loading).toBeFalsy()

    // wait for loading update
    await waitForNextUpdate()
    act(() => {
      gn()
      gn()
    })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(result.current[1].loading).toBeTruthy()

    return p
  })
})
