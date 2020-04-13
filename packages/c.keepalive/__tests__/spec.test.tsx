/**
 * @file spec
 * @author imcuttle
 * @description
 */
import KeepAlive, { bindKeepAliveLifeCycle, InputType } from '../'
import { mount, render } from 'enzyme'
import * as React from 'react'

class KeepAliveEnzymeFix extends KeepAlive {
  render() {
    return <div>{super.render()}</div>
  }
}

describe('KeepAlive', function() {
  let list
  beforeEach(() => {
    list = []
  })

  const KeepAliveLifeCycle = bindKeepAliveLifeCycle(
    class extends React.Component {
      componentDidUnactive(input: InputType) {
        list.push('componentDidUnactive', input)
      }
      componentWillActive(input: InputType) {
        list.push('componentWillActive', input)
      }
      componentWillUnactive(input: InputType) {
        list.push('componentWillUnactive', input)
      }
      componentDidActive(input: InputType) {
        list.push('componentDidActive', input)
      }
      render() {
        return this.props.children
      }
    }
  )

  const pages = {
    home: <h1>Home</h1>,
    detail: <h1>Detail</h1>,
    bHome: (
      <KeepAliveLifeCycle>
        <h1>BHome</h1>
      </KeepAliveLifeCycle>
    ),
    bDetail: (
      <KeepAliveLifeCycle>
        <h1>bDetail</h1>
      </KeepAliveLifeCycle>
    )
  }
  const Page = React.forwardRef(({ name }: any, ref?: any) => {
    return (
      <KeepAliveEnzymeFix ref={ref} uniqKey={name}>
        {pages[name]}
      </KeepAliveEnzymeFix>
    )
  })

  it('normal ', () => {
    const wrp = mount(<Page name={'home'} />)
    expect(wrp.html()).toMatchInlineSnapshot(
      `"<div><div class=\\"keep-live-core-panel keep-live-core-panel-active keep-live-core-panel-name-home\\"><h1>Home</h1></div></div>"`
    )

    wrp.setProps({
      name: 'detail'
    })

    expect(wrp.html()).toMatchInlineSnapshot(
      `"<div><div class=\\"keep-live-core-panel keep-live-core-panel-unactive keep-live-core-panel-name-home\\"><h1>Home</h1></div><div class=\\"keep-live-core-panel keep-live-core-panel-active keep-live-core-panel-name-detail\\"><h1>Detail</h1></div></div>"`
    )

    wrp.setProps({
      name: '__404'
    })
    expect(wrp.html()).toMatchInlineSnapshot(
      `"<div><div class=\\"keep-live-core-panel keep-live-core-panel-unactive keep-live-core-panel-name-home\\"><h1>Home</h1></div><div class=\\"keep-live-core-panel keep-live-core-panel-unactive keep-live-core-panel-name-detail\\"><h1>Detail</h1></div><div class=\\"keep-live-core-panel keep-live-core-panel-active keep-live-core-panel-name-__404\\"></div></div>"`
    )

    wrp.setProps({
      name: '__404',
      disabled: true
    })
    expect(wrp.html()).toMatchInlineSnapshot(
      `"<div><div class=\\"keep-live-core-panel keep-live-core-panel-unactive keep-live-core-panel-name-home\\"><h1>Home</h1></div><div class=\\"keep-live-core-panel keep-live-core-panel-unactive keep-live-core-panel-name-detail\\"><h1>Detail</h1></div><div class=\\"keep-live-core-panel keep-live-core-panel-active keep-live-core-panel-name-__404\\"></div></div>"`
    )
  })

  it('normal lifecycle', () => {
    // jest.spyOn(KeepAliveLifeCycle.prototype, 'componentWillActive')
    // jest.spyOn(KeepAliveLifeCycle.prototype, 'componentDidActive')
    // jest.spyOn(KeepAliveLifeCycle.prototype, 'componentWillUnactive')
    // jest.spyOn(KeepAliveLifeCycle.prototype, 'componentDidUnactive')
    const wrp = mount(<Page name={'bHome'} />)
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillActive",
  Object {
    "newValue": "bHome",
    "oldValue": undefined,
  },
  "componentDidActive",
  Object {
    "newValue": "bHome",
    "oldValue": undefined,
  },
]
`)

    list = []
    wrp.setProps({
      name: 'detail'
    })
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillUnactive",
  Object {
    "newValue": "detail",
    "oldValue": "bHome",
  },
  "componentDidUnactive",
  Object {
    "newValue": "detail",
    "oldValue": "bHome",
  },
]
`)

    list = []
    wrp.setProps({
      name: 'bHome'
    })
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillActive",
  Object {
    "newValue": "bHome",
    "oldValue": "detail",
  },
  "componentDidActive",
  Object {
    "newValue": "bHome",
    "oldValue": "detail",
  },
]
`)

    list = []
    wrp.setProps({
      name: 'bDetail'
    })
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillUnactive",
  Object {
    "newValue": "bDetail",
    "oldValue": "bHome",
  },
  "componentWillActive",
  Object {
    "newValue": "bDetail",
    "oldValue": "bHome",
  },
  "componentDidUnactive",
  Object {
    "newValue": "bDetail",
    "oldValue": "bHome",
  },
  "componentDidActive",
  Object {
    "newValue": "bDetail",
    "oldValue": "bHome",
  },
]
`)

    list = []
    wrp.setProps({
      name: 'bDetail'
    })
    expect(list).toMatchInlineSnapshot(`Array []`)

    list = []
    wrp.setProps({
      name: 'bHome'
    })
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillUnactive",
  Object {
    "newValue": "bHome",
    "oldValue": "bDetail",
  },
  "componentWillActive",
  Object {
    "newValue": "bHome",
    "oldValue": "bDetail",
  },
  "componentDidUnactive",
  Object {
    "newValue": "bHome",
    "oldValue": "bDetail",
  },
  "componentDidActive",
  Object {
    "newValue": "bHome",
    "oldValue": "bDetail",
  },
]
`)

    list = []
    wrp.setProps({
      name: 'home'
    })
    expect(list).toMatchInlineSnapshot(`
Array [
  "componentWillUnactive",
  Object {
    "newValue": "home",
    "oldValue": "bHome",
  },
  "componentDidUnactive",
  Object {
    "newValue": "home",
    "oldValue": "bHome",
  },
]
`)

    list = []
    wrp.setProps({
      name: 'detail'
    })
    expect(list).toMatchInlineSnapshot(`Array []`)
  })
})
