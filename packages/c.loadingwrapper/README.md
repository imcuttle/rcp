# @rcp/c.loadingwrapper

[![NPM version](https://img.shields.io/npm/v/@rcp/c.loadingwrapper.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/c.loadingwrapper)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/c.loadingwrapper.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/c.loadingwrapper)

A component for easy create loading mask

## Installation

```bash
npm install @rcp/c.loadingwrapper
# or use yarn
yarn add @rcp/c.loadingwrapper
```

## Usage

```jsx
import LoadingWrapper from '@rcp/c.loadingwrapper'
import '@rcp/c.loadingwrapper/style.less'

<LoadingWrapper isLoading>
    <div>some content</div>
</LoadingWrapper>
```

## Props

### `className`

- **Type:** `string`
- **Default:** `null`

### `isLoading`

- **Type:** `boolean`
- **Default:** `false`

### `renderLoadingDelayMs`

渲染 Loading 延迟毫秒数，为了减少不必要的视觉跳跃

- **Type:** `number`
- **Default:** `1000`

### `withDelayRenderFirstly`

是否首次的时候 Delay 渲染 Loading

- **Type:** `boolean`
- **Default:** `false`

### `LoadingComponent`

自定义 LoadingComponent

- **Type:** `Component|Function|string`
- **Default:** `null`

## Authors

This library is written and maintained by imcuttle, &lt;a href="<mailto:moyuyc95@gmail.com"">moyuyc95@gmail.com></a>.

## License

MIT
