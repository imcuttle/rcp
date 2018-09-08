import { FormatFunc, ILogger } from './types'
export default function makeCreateLogger(
  formatFunc: FormatFunc
): (
  namespace?: string,
  {
    prefix,
    suffix
  }?: {
    prefix?: string
    suffix?: string
  }
) => ILogger
