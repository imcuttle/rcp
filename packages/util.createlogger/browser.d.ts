/**
 * @file browser
 * @author Cuttle Cong
 * @date 2018/9/8
 */
declare const _default: (
  namespace?: string,
  {
    prefix,
    suffix
  }?: {
    prefix?: string
    suffix?: string
  }
) => import('./types').ILogger
export default _default
