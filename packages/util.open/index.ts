import createMount, { IMountOptions } from '@rcp/util.createmount'
// @ts-ignore
import * as lazy from 'lazy-value'
import {ReactElement} from "react";

export function createOpenReactStandalone({className, ...opts}: { className?: string } & IMountOptions = {}) {
  const center = createMount(opts)

  let _container
  let createGetContainer = () => lazy(
    () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      div.classList.add('modal-open-controller')
      if (className) {
        div.classList.add(className)
      }
      _container = div
      return div
    }
  )
  let getContainer = createGetContainer()

  return Object.assign((createElement: (close: (result?: any) => void) => ReactElement) => {
    let resolve: Function
    const p = new Promise(r => {
      resolve = r
    })

    const close = (result: any) => {
      center.close()
      resolve(result)
    }

    const container = getContainer()
    center.open({
      element: createElement(close),
      mountNode: container
    })

    return Object.assign(p, { ...center, containerDOM: container })
  }, {
    remove: () => {
      if (_container) {
        _container.remove()
        getContainer = createGetContainer()
      }
    }
  })
}

const openReactStandalone = createOpenReactStandalone()

export default openReactStandalone
