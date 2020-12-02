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

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong06@meituan.com">yucong06@meituan.com</a>.

## License

MIT