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
 * 修饰非控制组件，会添加 default${propName} 属性
 * 用于填充 ${propName} 第一次初始化值
 * @param propList {string[]}
 * @param {{withDefault: boolean}}
 * @return {Function}
 */
export default function uncontrolled(propList = [], { withDefault = true } = {}) {
  logger.invariant(
    Array.isArray(propList) && propList.every(x => typeof x === 'string'),
    `\`propList\` should be string[], but ${typeof propList}`
  )

  return function uncontrolled(Component) {
    logger.invariant(isComponentClass(Component), `\`Component\` should be a react component class`)

    if (!propList.length) {
      return Component
    }

    return class Uncontrolled extends Component {
      static displayName = `Uncontrolled_${displayName(Component)}`
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
  }
}
