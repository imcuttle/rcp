/**
 * Determine react component instance
 * @public
 * @param instance {any}
 * @return {boolean}
 * @example
 * import { isComponentInstance } from '@rcp/util.iscompclass'
 * class View extends React.Component {}
 *
 * isComponentInstance(View.prototype)
 */
export declare function isComponentInstance(instance: any): boolean;
/**
 * Determine react component class
 * @public
 * @see [how-to-determine-if-js-object-is-react-component](https://discuss.reactjs.org/t/how-to-determine-if-js-object-is-react-component/2825/5)
 * @param component {any}
 * @return {boolean}
 */
export default function isComponentClass(component: any): boolean;
