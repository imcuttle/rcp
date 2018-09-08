# @rcp/util.createlogger

[![NPM version](https://img.shields.io/npm/v/@rcp/util.createlogger.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/util.createlogger)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/util.createlogger.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/util.createlogger)

The internal about common isomorphic logger with namespace.

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

logger.log('%s abc', 'ok')
logger.success({ a: '222' }, 'ok')
logger.warn({})
logger.debug()
logger.error()
logger.invariant(typeof document !== 'undefined', 'the library should be used in browser environment.')
```

## API

### `createLogger(namespace?: string, opts)`

#### Parameters

##### `namespace`

The namespace of logger.

##### `opts`

- **prefix**: (default: `'('`)

- **suffix**: (default: `')'`)

- **typeMap**: eg

  ```
  {
    Log: "I'm a Log",
    Success: "Wow!",
    Warning: "Warn!",
    Error: "Error happened",
  }
  ```

The formatted string are composed by `{type}{prefix}{namespace}{suffix}: {message}`.

e.g. `Success(foo): Done!`

#### Returns

##### `log`

- Type: `function`

##### `success`

- Type: `function`

##### `warn`

- Type: `function`

##### `debug`

- Type: `function`

##### `error`

- Type: `function`

##### `invariant`

It will throw Error with `message` when `check` is false

- Type: `(check: boolean, message?: string) => void`

## Related

## Authors

This library is written and maintained by imcuttle, <mailto:moyuyc95@gmail.com>.

## License

MIT
