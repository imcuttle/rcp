/**
 * @file uncontrolled
 * @author Cuttle Cong
 * @date 2018/6/16
 * @description
 */
/**
 * 修饰非控制组件，会添加 default${propName} 属性
 * 用于填充 ${propName} 第一次初始化值
 * @param propList {string[]}
 * @param {{withDefault: boolean}}
 * @return {Function}
 */
export default function uncontrolled(
  propList?: any[],
  {
    withDefault
  }?: {
    withDefault?: boolean
  }
): (Component: any) => any
