# @rcp/util.createlogger

[![NPM version](https://img.shields.io/npm/v/@rcp/util.createlogger.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/util.createlogger)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/util.createlogger.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/util.createlogger)

The internal about common logger

## Installation

```bash
npm install @rcp/util.createlogger
# or use yarn
yarn add @rcp/util.createlogger
```

## Usage

```javascript
import createLogger from '@rcp/util.createlogger'

const logger = createLogger('@rcp/hoc.i18n')

logger.invariant()
logger.log('')

export interface ILogger {
  invariant: (check: boolean, message?: string) => void
  success: FormatFunc
  format: FormatFunc
  log: LoggerFunc
  warn: LoggerFunc
  debug: LoggerFunc
  error: LoggerFunc
}
```

## API

## Related

## Authors

This library is written and maintained by imcuttle, <mailto:moyuyc95@gmail.com>.

## License

MIT
