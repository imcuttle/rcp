/**
 * @file types
 * @author Cuttle Cong
 * @date 2018/9/8
 *
 */

export interface IFormat {
  message?: string
  namespace?: string
  type?: string
  argv?: any[]
}
export interface IFormatOpts {
  prefix?: string
  suffix?: string
  typeMap?: ITypeMap
}
export interface ITypeMap {
  Log?: string
  Success?: string
  Warning?: string
  Error?: string
}

export type FormatFunc = (format: IFormat, opts?: IFormatOpts) => string
export type LoggerFunc = (message: any, ...argv: any[]) => void

export interface ILogger {
  invariant: (check: boolean, message?: string) => void
  format: FormatFunc
  log: LoggerFunc
  warn: LoggerFunc
  success: LoggerFunc
  debug: LoggerFunc
  error: LoggerFunc
}
