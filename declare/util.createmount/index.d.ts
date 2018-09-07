import { ReactElement } from 'react'
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
export default function createMountCenter<P = any>(centerOpts?: IMountOptions<P>): IMountCenter
