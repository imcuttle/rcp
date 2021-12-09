/**
 * @file index.ts
 * @author 余聪
 *
 */
import * as React from 'react'
import usePersistFn from '@rcp/use.persistfn'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export interface UsePreventFastOperationOptions<T extends Function = () => void> {
  defaultLoading?: boolean
  onOperation?: T
}

export function usePreventFastOperation<T extends Function>({
  onOperation,
  defaultLoading
}: UsePreventFastOperationOptions<T>): [T, { loading: boolean }] {
  const canClickRef = React.useRef(true)
  const [loadingState, setLoading] = React.useState(defaultLoading)
  // @ts-ignore
  const _fn = usePersistFn(onOperation)
  const fn = React.useCallback(
    async (evt) => {
      if (!canClickRef.current) {
        return
      }
      if (_fn) {
        canClickRef.current = false
        const res = await Promise.race([
          Promise.resolve(_fn(evt))
            .then(() =>
              // 防止同步 onClick
              delay(100)
            )
            .finally(() => {
              setLoading(false)
              canClickRef.current = true
            }),
          new Promise((resolve) => {
            setTimeout(resolve, 300, '$timeout')
          })
        ])
        if (res === '$timeout') {
          setLoading(true)
          canClickRef.current = false
        }
      }
    },
    [_fn, setLoading]
  )

  const data = React.useMemo(() => ({ loading: loadingState }), [loadingState])
  return [fn as any, data]
}

export type PreventFastOperationProps = {
  operationName: string
  onOperation: any
  defaultLoading?: boolean
  children: React.ReactElement
}

export function PreventFastOperation({
  operationName,
  onOperation,
  defaultLoading,
  children,
  ...props
}: PreventFastOperationProps) {
  const [onFn, { loading }] = usePreventFastOperation({ onOperation, defaultLoading })
  return React.cloneElement(children, {
    loading,
    [operationName]: onFn,
    ...props
  })
}

export function PreventFastClick({
  onClick,
  children,
  ...props
}: {
  onClick?: any
} & Omit<PreventFastOperationProps, 'operationName' | 'onOperation'>) {
  return (
    <PreventFastOperation {...props} operationName={'onClick'} onOperation={onClick}>
      {children}
    </PreventFastOperation>
  )
}
