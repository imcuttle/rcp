# @rcp/use.behaviorsubject

[![NPM version](https://img.shields.io/npm/v/@rcp/use.behaviorsubject.svg?style=flat-square)](https://www.npmjs.com/package/@rcp/use.behaviorsubject)
[![NPM Downloads](https://img.shields.io/npm/dm/@rcp/use.behaviorsubject.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@rcp/use.behaviorsubject)

use hook for rxjs behavior subject

## Installation

```bash
npm install @rcp/use.behaviorsubject
# or use yarn
yarn add @rcp/use.behaviorsubject
```

## Usage

### useBehaviorSubject

```javascript
import { BehaviorSubject } from 'rxjs'
import { useBehaviorSubject } from '@rcp/use.behaviorsubject'

const subject = new BehaviorSubject({ name: 'imcuttle' })
const App = () => {
  const [data, setData] = useBehaviorSubject(subject)
}
```

### createReactBehaviorSubject

```javascript
import { createReactBehaviorSubject } from '@rcp/use.behaviorsubject'
const { subject, useSubject } = createReactBehaviorSubject({ name: 'imcuttle' })

const App = () => {
  const [data, setData] = useSubject()
}
```

### useStateToSubject

React state pipe to subject, and subject effects to state

```javascript
import { BehaviorSubject } from 'rxjs'
import { useStateToSubject } from '@rcp/use.behaviorsubject'
const { subject, useSubject } = createReactBehaviorSubject({ name: 'imcuttle' })

const userSubject = new BehaviorSubject({})
const App = () => {
  const [user, setUser] = React.useState({ name: 'imcuttle' })
  useStateToSubject([user, setUser], userSubject)
}
```

## API

## Related

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong@yuanfudao.com">yucong@yuanfudao.com</a>.

## License

MIT
