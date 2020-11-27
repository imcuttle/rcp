import * as H from 'history'
import {ReactElement, RefObject} from 'react'
import * as React from 'react'
import {useHistory} from 'react-router'
import * as isEqual from 'lodash.isequal'
import { createOpenReactStandalone } from '@rcp/util.open/index'

const openReactStandalone = createOpenReactStandalone({ className: 'rcp-prompt-mount-container' })

export type MessageType = (location: H.Location, action: H.Action) => string | boolean

type CloseFn = (result?: any) => void
type GetPromptComponentInput = (
  input: {
    close: CloseFn
    message: string
  }
) => ReactElement

// message
type GetPromptComponent = null | GetPromptComponentInput

const PromptContext = React.createContext<{
  getPromptComponent?: GetPromptComponent
  shouldSkipBlockRef: RefObject<boolean>
  openPrompt?: (
    opt: Partial<{
      msg: string
      location: H.Location
      action: H.Action
      onBefore: (isOk: boolean) => void
    }>
  ) => Promise<boolean>
}>({ getPromptComponent: null, shouldSkipBlockRef: React.createRef<boolean>() })

export const PromptConsumer = PromptContext.Consumer

export const usePrompt = () => React.useContext(PromptContext)

export const PromptProvider: React.FC<{
  getPromptComponent?: GetPromptComponent
}> = ({ getPromptComponent, children }) => {
  const history = useHistory()
  const shouldSkipBlockRef = React.useRef(false)
  const ctx = React.useMemo(
    () => ({
      getPromptComponent,
      shouldSkipBlockRef,
      openPrompt: getPromptComponent
        ? async ({ msg, location, action, onBefore }: any = {}) =>
            openReactStandalone(close => getPromptComponent({ close, message: msg })).then(isOk => {
              // eslint-disable-next-line no-unused-expressions
              onBefore && onBefore(isOk)
              if (isOk) {
                const tmp = shouldSkipBlockRef.current
                shouldSkipBlockRef.current = true
                if (action === 'REPLACE') {
                  history.replace(location)
                } else if (action === 'PUSH') {
                  history.push(location)
                } else {
                  history.replace(location)
                }
                shouldSkipBlockRef.current = tmp
              }
              return isOk
            })
        : null
    }),
    [history, shouldSkipBlockRef, getPromptComponent]
  )

  return (
    // @ts-ignore
    <PromptContext.Provider value={ctx}>{children}</PromptContext.Provider>
  )
}

type WhenFn = (
  type: 'unload' | 'locationUpdate',
  data?: {
    prev: { location: H.History['location']; action: H.Action }
    next: { location: H.History['location']; action: H.Action }
  }
) => boolean

// @ts-ignore
const Prompt: React.FC<{
  triggerOnBeforeUnload?: boolean
  onBeforeOpenCustomPrompt?: (isOk: boolean) => void
  onAfterOpenCustomPrompt?: (isOk?: boolean) => void
  when?: boolean | WhenFn
  message?: string | MessageType
}> = ({ triggerOnBeforeUnload = true, onBeforeOpenCustomPrompt, onAfterOpenCustomPrompt, message, children, when }) => {
  const history = useHistory()
  const { openPrompt, shouldSkipBlockRef } = usePrompt()

  React.useEffect(
    () => {
      const shouldIntercept = (type: 'unload' | 'locationUpdate', data?: any) => {
        if (typeof when === 'function' && !when(type, data)) {
          return false
        }
        return !!when
      }

      let handle: any
      if (triggerOnBeforeUnload) {
        handle = (e: any) => {
          const _shouldIntercept = shouldIntercept('unload')
          if (!_shouldIntercept) {
            return
          }

          e = e || window.event

          let msg: any = message
          if (typeof message === 'function') {
            msg = message(history.location, history.action)
          }

          if (msg) {
            // 兼容IE8和Firefox 4之前的版本
            if (e) {
              e.returnValue = msg
            }
            // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            return msg
          }
        }
        window.addEventListener('beforeunload', handle)
      }

      const dispose = history.block((location, action) => {
        if (shouldSkipBlockRef.current) {
          return
        }

        if (isEqual({ ...location, state: null }, { ...history.location, state: null })) {
          return
        }

        const _shouldIntercept = shouldIntercept('locationUpdate', {
          prev: { location: history.location, action: history.action },
          next: { location, action }
        })
        if (!_shouldIntercept) {
          return true
        }

        let msg: any = message
        if (typeof message === 'function') {
          msg = message(location, action)
        }

        if (msg && typeof msg === 'string' && typeof openPrompt === 'function') {
          // 自定义 prompt
          // eslint-disable-next-line promise/catch-or-return
          openPrompt({
            msg,
            location,
            action,
            onBefore: onBeforeOpenCustomPrompt
          }).then(onAfterOpenCustomPrompt)
          return false
        }
        return msg || false
      })
      return () => {
        dispose()
        // eslint-disable-next-line no-unused-expressions
        handle && window.removeEventListener('beforeunload', handle)
      }
    },
    [when, history, shouldSkipBlockRef, triggerOnBeforeUnload, onAfterOpenCustomPrompt, onBeforeOpenCustomPrompt, openPrompt]
  )

  return children
}

export default Prompt
