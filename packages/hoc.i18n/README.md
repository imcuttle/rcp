# @rcp/hoc.i18n

[![NPM version](https://img.shields.io/npm/v/@rcp/hoc.i18n.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/hoc.i18n)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/hoc.i18n.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/hoc.i18n)

React Component's high order component about internationalization

## Installation

```bash
npm install @rcp/hoc-i18n
# or use yarn
yarn add @rcp/hoc-i18n
```

## Usage

```javascript
import i18n from '@rcp/hoc-i18n'

const currentLang = 'en-us'
@i18n(
  {
    'en-us': {
      hello: 'hello, ${1}'
    },
    'zh-cn': {
      hello: '你好, ${1}'
    }
  },
  currentLang
)
class View extends React.Component {
  render() {
    return <p>{this.i('hello', this.props.title)}</p>
  }
}

// `<View title="Jilly" />`
//    equals to `<p>hello, Jilly</p>`

// `<View title="Jilly" locale={{ hello: 'hello from locale, ${1}' }} />`
//    equals to `<p>hello from locale, Jilly</p>`

// `<View title="Jilly" language="zh-cn" />`
//    equals to `<p>你好, Jilly</p>`
```

### Customize Component's i18n

```javascript
import i18n from '@rcp/hoc-i18n'

const currentLang = 'en-us'
@i18n(
  {
    'en-us': {
      hello: 'hello, ${1}'
    }
  },
  currentLang
)
class View extends React.Component {
  render() {
    return <p>{this.i('hello', this.props.title)}</p>
  }
}

// Customize view's dictionaries
View.i18n // See https://github.com/imcuttle/tiny-i18n/tree/master/packages/tiny-i18n
View.i18n.setLanguage('zh-cn')
View.i18n.setDictionary(
  {
    hello: '你好, ${1}'
  },
  'zh-cn'
)
```

### Preset dictionary by default

```javascript
import i18n from '@rcp/hoc-i18n'

@i18n({
  hello: 'hello, ${1}',
  tip: 'awesome'
})
class View extends React.Component {
  render() {
    return (
      <p>
        {this.i('hello', this.props.title)}
        <span>{this.i('tip')}</span>
      </p>
    )
  }
}

// Customize dictionary from `props.locale`
// `<View title="Jilly" locale={{ hello: 'hello from locale, ${1}' }} />`
//    equals to `<p>hello from locale, Jilly<span>awesome</span></p>`
```

### Preset multiple dictionaries

```javascript
import i18n from '@rcp/hoc-i18n'

@i18n({
  'zh': {
    hello: '你好, ${1}',
    tip: '酷'
  },
  'en': {
    hello: 'hello, ${1}',
    tip: 'awesome'
  },
})
class View extends React.Component {
  render() {
    return (
      <p>
        {this.i('hello', this.props.title)}
        <span>{this.i('tip')}</span>
      </p>
    )
  }
}

// `<View title="Jilly" language="zh" />`
// => '<p>你好 Jilly<span>酷</span></p>'
```

## Related

- [tiny-i18n](https://github.com/imcuttle/tiny-i18n/tree/master/packages/tiny-i18n) - Tiny yet useful i18n library

## Authors

This library is written and maintained by imcuttle, <mailto:moyuyc95@gmail.com>.

## License

MIT
