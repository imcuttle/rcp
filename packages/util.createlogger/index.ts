/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as u from 'util'
import * as d from 'debug'

export interface IFormat {
  message?: string
  type?: string
  argv?: any[]
}

export type FormatFunc = (format: IFormat) => string
export type LoggerFunc = (message: string, ...argv: any[]) => void

export interface ILogger {
  invariant: (check: boolean, message?: string) => void
  format: FormatFunc
  log: LoggerFunc
  warn: LoggerFunc
  debug: LoggerFunc
  error: LoggerFunc
}

export default function createLogger(namespace: string = ''): ILogger {
  function invariant(check: boolean, message = '') {
    if (!check) {
      throw new Error(format({ message }))
    }
  }

  const debug = d(namespace)
  const str = namespace !== '' ? `(${namespace})` : namespace
  function format({ message = '', type = '', argv = [] }: IFormat = {}): string {
    message = u.format(message, ...argv)
    return `${type}${str}: ${message}`
  }

  function log(message, ...argv) {
    console.log(format({ message, argv, type: '' }))
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
    warn,
    debug,
    error
  }
}
