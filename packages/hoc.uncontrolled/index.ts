/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */

import isComponentClass from '@rcp/util.iscompclass'
import displayName from '@rcp/util.displayname'
import createLogger from '@rcp/util.createlogger'

const logger = createLogger(require('./package.json').name)

function getDefaultName(name: string = '') {
  return 'default' + name[0].toUpperCase() + name.slice(1)
}

function normalizePropList(propList: Prop[]): StrictProp[] {
  return propList.map(prop => {
    if (typeof prop === 'string') {
      return {
        withDefault: true,
        eq: defaultEq,
        name: prop
      }
    }
    return {
      withDefault: true,
      eq: defaultEq,
      ...prop
    }
  })
}

/**
 * @typedef StrictProp
 * @public
 * @param name {string}
 * @param [withDefault=true] {boolean} - Whether check `default{propKey}` firstly
 * @param [eq=(a, b) => a === b] {Function} - Detect new value and old value is equal
 */
export type StrictProp = { name: string; withDefault?: boolean; eq?: (oldValue, newValue) => boolean }

/**
 * @typedef Prop {string | StrictProp}
 * @public
 */
export type Prop = string | StrictProp

const defaultEq = (a, b) => a === b

/**
 *
 * @public
 * @param propList {Prop[]} eg. `['value']` / `[{ name: 'value', withDefault: false }]`
 * @return {Function} `(Component: React.ComponentClass) => React.ComponentClass`
 */
export default function uncontrolled(propList: Prop[] = []) {
  let propArray = normalizePropList(propList)

  return function uncontrolled(Component: React.ComponentClass): React.ComponentClass {
    logger.invariant(isComponentClass(Component), `\`Component\` should be a react component class`)

    if (!propList.length) {
      return Component
    }

    class Uncontrolled extends Component {
      static displayName = `Uncontrolled_${displayName(Component)}`
      state: any
      constructor(props) {
        super(props)
        this.state = this.state || {}
        propArray.forEach(prop => {
          const propName = prop.name
          if (prop.withDefault) {
            const defaultPropName = getDefaultName(propName)
            this.state[propName] =
              typeof this.props[propName] === 'undefined'
                ? typeof this.props[defaultPropName] === 'undefined'
                  ? this.state[propName]
                  : this.props[defaultPropName]
                : this.props[propName]
          } else {
            if (typeof this.props[propName] !== 'undefined') {
              this.state[propName] = this.props[propName]
            }
          }
        })
      }

      componentWillReceiveProps(newProps) {
        if (super.componentWillReceiveProps) {
          super.componentWillReceiveProps.apply(this, arguments)
        }

        const newState = {}
        let hasNewRecord = false
        propArray.forEach(prop => {
          const { name: propName, eq = defaultEq } = prop
          if (typeof newProps[propName] !== 'undefined' && !eq(this.state[propName], newProps[propName])) {
            newState[propName] = newProps[propName]
            hasNewRecord = true
          }
        })
        if (hasNewRecord) {
          this.setState(newState)
        }
      }
    }
    return Uncontrolled
  }
}
