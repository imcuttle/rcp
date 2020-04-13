# @rcp/c.keepalive

[![NPM version](https://img.shields.io/npm/v/@rcp/c.keepalive.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/c.keepalive)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/c.keepalive.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/c.keepalive)

Keep react component view / store when switched view rather than unmount it.

## Installation

```bash
npm install @rcp/c.keepalive
# or use yarn
yarn add @rcp/c.keepalive
```

## Usage

```jsx
import KeepAlive, { bindKeepAliveLifeCycle } from '@rcp/c.keepalive'
import '@rcp/c.keepalive/style.less'

@bindKeepAliveLifeCycle
class Content extends React.Component {
    // 新增的生命周期
    componentWillActive({newValue, oldValue}) {}
    componentDidActive({newValue, oldValue}) {}
    componentWillUnactive({newValue, oldValue}) {}
    componentDidUnactive({newValue, oldValue}) {}
}

<KeepAlive uniqKey="/home" >
    <Content>Home</Content>
<KeepAlive>
// LifeCycle
// componentWillActive => {newValue: '/home'}
// componentDidActive => {newValue: '/home'}

// Components
// <>
//   <Content>Home</Content>
// </>

// Update
<KeepAlive uniqKey="/detail" >
    <Content>Detail</Content>
<KeepAlive>
// LifeCycle
// componentWillUnactive => {newValue: '/detail', oldValue: '/home'} (Home)
// componentWillActive => {newValue: '/detail', oldValue: '/home'} (Detail)
// componentDidUnactive => {newValue: '/detail', oldValue: '/home'} (Home)
// componentDidActive => {newValue: '/detail', oldValue: '/home'} (Detail)

// Components
// <>
//   <Content (display: none)>Home</Content>
//   <Content>Detail</Content>
// </>
```

## Props

### `uniqKey`

- **Type:** `string`

### `disabled`

- **Type:** `boolean`

## Related

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com"">moyuyc95@gmail.com</a>.

## License

MIT
