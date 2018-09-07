/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as ReactDOM from 'react-dom'
import { ReactElement, ReactNode } from 'react'

export interface IMountOptions<P = any> {
  mountNode?: Node
  attributes?: any
  element?: ReactElement<P>
}

export interface IMountCenter<P = any> {
  close: () => void
  open: (options?: IMountOptions<P>) => Node
}

/**
 *
 * @param {IMountOptions<P>} centerOpts
 * @return {IMountCenter}
 */
export default function createMountCenter<P = any>(centerOpts: IMountOptions<P> = {}): IMountCenter {
  centerOpts = Object.assign(
    {
      mountNode: document.body
    },
    centerOpts
  )

  let container: Node = null
  function getContainer(attrs: any = centerOpts.attributes, mNode: Node = centerOpts.mountNode) {
    if (!container) {
      container = document.createElement('div')
      mNode.appendChild(container)
    }
    return Object.assign(container, attrs)
  }

  return {
    close() {
      let dom = getContainer()
      ReactDOM.unmountComponentAtNode(dom)
      dom.parentNode.removeChild(dom)
      container = null
    },
    open({ element = centerOpts.element, mountNode = centerOpts.mountNode, attributes = centerOpts.attributes } = {}) {
      const dom = getContainer(attributes, mountNode)
      ReactDOM.render<P>(element, dom)
      return dom
    }
  }
}
