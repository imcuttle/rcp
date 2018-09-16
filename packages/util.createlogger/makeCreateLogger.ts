/**
 * @file index.ts
 * @author imcuttle
 *
 */
import { FormatFunc, IFormat, IFormatOpts, ILogger } from './types'

export default function makeCreateLogger(formatFunc: FormatFunc) {
  return function createLogger(namespace: string = '', opt: IFormatOpts = {}): ILogger {
    function invariant(check: boolean, message = '') {
      if (!check) {
        throw new Error(format({ message }))
      }
    }

    function format(arg: IFormat = {}): string {
      return formatFunc({ namespace, argv: [], ...arg }, { ...opt })
    }

    function log(message, ...argv) {
      console.log(format({ message, argv, type: 'Info' }))
    }

    function success(message, ...argv) {
      console.log(format({ message, argv, type: 'Success' }))
    }

    function warn(message, ...argv) {
      console.warn(format({ message, argv, type: 'Warning' }))
    }

    function error(message, ...argv) {
      console.error(format({ message, argv, type: 'Error' }))
    }
    return {
      invariant,
      format,
      log,
      info: log,
      success,
      warn,
      debug: require('debug')(namespace),
      error
    }
  }
}
