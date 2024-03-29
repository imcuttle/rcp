/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as ReactDOM from 'react-dom'
import { ReactElement } from 'react'

export interface IMountOptions<P = any> {
  mountNode?: Node
  attributes?: any
  element?: ReactElement<P>
  wrapper?: (reactElem: ReactElement) => ReactElement
}

export interface IMountCenter<P = any> {
  close: () => void
  open: (options?: IMountOptions<P>) => Node
}

/**
 * @public
 * @param {IMountOptions<P>} opts
 * @param {Node} [opts.mountNode = document.body] - mountNode fallback in `open` function
 * @param {any} [opts.attributes] - attributes fallback in `open` function
 * @param {ReactElement<P>} [opts.element] - element fallback in `open` function
 * @param {(elem: ReactElement<P>) => ReactElement<P>} [opts.wrapper] - element wrapper
 * @return {IMountCenter}
 */
export default function createMountCenter<P = any>(opts: IMountOptions<P> = {}): IMountCenter {
  const centerOpts = Object.assign(
    {
      mountNode: document.body,
      wrapper: (elem) => elem
    },
    opts
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
      container = null
      ReactDOM.unmountComponentAtNode(dom)
      dom.parentNode && dom.parentNode.removeChild(dom)
    },
    open({
      element = centerOpts.element,
      wrapper = centerOpts.wrapper,
      mountNode = centerOpts.mountNode,
      attributes = centerOpts.attributes
    } = {}) {
      const dom = getContainer(attributes, mountNode)
      ReactDOM.render<P>(wrapper ? wrapper(element) : element, dom)
      return dom
    }
  }
}
