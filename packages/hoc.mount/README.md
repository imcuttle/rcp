# @rcp/hoc.mount

[![NPM version](https://img.shields.io/npm/v/@rcp/hoc.mount.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/hoc.mount)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/hoc.mount.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/hoc.mount)

The high order component for mounting component

It's useful on modal component which requires should be mounted at other node (e.g. `document.body`) or requires single rendering instance.

## Installation

```bash
npm install @rcp/hoc.mount
# or use yarn
yarn add @rcp/hoc.mount
```

## Usage

```javascript
import mount from '@rcp/hoc.mount'

const Title = mount()(({ props }) => <h2>{props.title}</h2>)

ReactDOM.render(
  <div>
    <Title title="foo" />
    <Title title="bar" />
  </div>,
  window.root
)
// document.body.outerHTML
// <body>
//   <div id="root"></div>
//   <div><h2>bar</h2></div>
// </body>

const TitleComponent = mount({
  createTimeType: 'component',
  attributesGetter: ({ title }) => ({ id: title })
})(({ props }) => <h2>{props.title}</h2>)

ReactDOM.render(
  <div>
    <Title title="foo" />
    <Title title="bar" />
    <Title title="barbar" />
  </div>,
  window.root
)
// document.body.outerHTML
// <body>
//   <div id="root"></div>
//   <div id="foo"><h2>foo</h2></div>
//   <div id="bar"><h2>bar</h2></div>
//   <div id="barbar"><h2>barbar</h2></div>
// </body>
```

## API

#### Options

- `createTimeType` **(`"decorator"` \| `"class"` \| `"component"`)** (optional, default `'class'`)

  Create mount center in which time.

  - `decorator`: create at calling `mount()` time.
  - `class`: create at calling `mount()(Component)` time.
  - `component`: create at rendering `mount()(Component)` time.

- `mountNodeGetter` **(`(props) => HTMLElement`)** (optional, default `() => document.body`)
- `attributesGetter` **(`(props) => any`)** (optional, default `() => {}`)

## Related

- [@rcp/util.createmount](../util.createmount) - The utility for creating mountable view

## Authors

This library is written and maintained by imcuttle, <mailto:moyuyc95@gmail.com>.

## License

MIT
