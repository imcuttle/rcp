import { FormatFunc, IFormatOpts, ILogger } from './types'
export default function makeCreateLogger(formatFunc: FormatFunc): (namespace?: string, opt?: IFormatOpts) => ILogger
