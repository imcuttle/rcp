/**
 * @file browser
 * @author Cuttle Cong
 * @date 2018/9/8
 */

import makeCreateLogger from './makeCreateLogger'
import * as u from 'util'

export const Map = {
  Log: ''
}

export default makeCreateLogger(function(
  { namespace, message, type, argv },
  { prefix = '(', suffix = ')', typeMap = Map } = {}
) {
  const str = namespace !== '' ? `${prefix}${namespace}${suffix}` : namespace
  message = u.format(message, ...argv)

  type = typeMap[type] || type || ''
  return `${type}${str}: ${message}`
})
