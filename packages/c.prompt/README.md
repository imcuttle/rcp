# @rcp/c.prompt

[![NPM version](https://img.shields.io/npm/v/@rcp/c.prompt.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/c.prompt)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/c.prompt.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/c.prompt)

Advanced React router prompt support beforeunload

## Installation

```bash
npm install @rcp/c.prompt react-router
# or use yarn
yarn add @rcp/c.prompt react-router
```

## Usage

```javascript
import Prompt, { PromptProvider } from '@rcp/c.prompt'

render(
  <PromptProvider>
    <Prompt when={true} message="Prompt Tips" />
  </PromptProvider>
)

// 自定义 Prompt 弹窗视图
render(
  <PromptProvider
    getPromptComponent={({ message, close }) => <Modal onOk={() => close(true)} onCancel={() => close(false)} />}
  >
    <Prompt when={true} message="Prompt Tips" />
  </PromptProvider>
)
```

## API

### Props

#### `triggerOnBeforeUnload`

是否绑定 window.onbeforeunload 事件。
当绑定后，message 也会在关闭窗口之前进行弹窗

- **Type:** `boolean`
- **Default:** `true`

#### `when`

自定义 Prompt 弹窗之后触发，一般不需要使用

- **Type:** `boolean | ('locationUpdate | '', data: null | { prev: { location, action }, next: { location, action } }) => boolean`

#### `message`

弹窗信息

- **Type:** `string | boolean | ((location, action) => string | boolean)`

message?: string | boolean | MessageType

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong06@meituan.com">yucong06@meituan.com</a>.

## License

MIT
