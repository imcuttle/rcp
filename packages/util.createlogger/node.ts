/**
 * @file node
 * @author Cuttle Cong
 * @date 2018/9/8
 */

import makeCreateLogger from './makeCreateLogger'
import * as u from 'util'
import * as logSymbols from 'log-symbols'

export const SYMBOLS_MAP = {
  Log: `${logSymbols.info} `,
  Success: `${logSymbols.success} `,
  Warning: `${logSymbols.warning} `,
  Error: `${logSymbols.error} `
}

export default makeCreateLogger(function(
  { namespace, message, type, argv },
  { prefix = '(', suffix = ')', typeMap = SYMBOLS_MAP } = {}
) {
  const str = namespace !== '' ? `${prefix}${namespace}${suffix}` : namespace
  message = u.format(message, ...argv)

  type = typeMap[type] || type || ''
  return `${type}${str}: ${message}`
})
