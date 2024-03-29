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
export default function createMountCenter<P = any>(opts?: IMountOptions<P>): IMountCenter
