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

/**
 *
 * @public
 * @param propList {string[]} eg. `['value']`
 * @param {{}} options
 * @param {boolean} [options.withDefault = true] - Whether check `default{propKey}` firstly
 * @return {Function} `(Component: React.ComponentClass) => React.ComponentClass`
 */
export default function uncontrolled(propList = [], { withDefault = true } = {}) {
  logger.invariant(
    Array.isArray(propList) && propList.every(x => typeof x === 'string'),
    `\`propList\` should be string[], but ${typeof propList}`
  )

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
        propList.forEach(prop => {
          if (withDefault) {
            const defaultPropName = getDefaultName(prop)
            this.state[prop] =
              typeof this.props[prop] === 'undefined'
                ? typeof this.props[defaultPropName] === 'undefined'
                  ? this.state[prop]
                  : this.props[defaultPropName]
                : this.props[prop]
          } else {
            if (typeof this.props[prop] !== 'undefined') {
              this.state[prop] = this.props[prop]
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
        propList.forEach(prop => {
          if (typeof newProps[prop] !== 'undefined' && this.state[prop] !== newProps[prop]) {
            newState[prop] = newProps[prop]
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
