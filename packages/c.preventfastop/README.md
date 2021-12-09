# @rcp/c.preventfastop

[![NPM version](https://img.shields.io/npm/v/@rcp/c.preventfastop.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/c.preventfastop)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/c.preventfastop.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/c.preventfastop)

Prevent some fast operation (eg. click)

## Installation

```bash
npm install @rcp/c.preventfastop
# or use yarn
yarn add @rcp/c.preventfastop
```

## Usage

```jsx
import { PreventFastClick, PreventFastOperation } from '@rcp/c.preventfastop'

const App = () => {
  return (
    <div>
      <PreventFastOperation
        operationName={'onClick'}
        onOperation={async () => {
          await apiSubmit()
        }}
      >
        <Button>提交</Button>
      </PreventFastOperation>
      {/* Same as */}
      <PreventFastClick
        onClick={async () => {
          await apiSubmit()
        }}
      >
        <Button>提交</Button>
      </PreventFastClick>
    </div>
  )
}
```

## API

## Related

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong@yuanfudao.com">yucong@yuanfudao.com</a>.

## License

MIT
