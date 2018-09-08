/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import mount from '../'

describe('hocMount', function() {
  beforeAll(function() {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)
  })
  it('should spec', () => {
    const Comp = mount({
      attributesGetter: () => ({
        id: 'container'
      }),
      mountNodeGetter: () => document.body
    })(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <button>haha</button>
        }
      }
    )

    class App extends React.Component<any> {
      render() {
        return this.props.visible ? <Comp /> : null
      }
    }

    ReactDOM.render(<App />, document.getElementById('root'))
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="root"
  />
</body>
`)

    ReactDOM.render(<App visible />, document.getElementById('root'))
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="root"
  />
  <div
    id="container"
  >
    <button>
      haha
    </button>
  </div>
</body>
`)
  })

  it('should attributesGetter and ref', () => {
    const Comp = mount({
      attributesGetter: props => props
    })<{ id: string }>(() => <h2 />)

    let ref
    ReactDOM.render(<Comp ref={r => (ref = r)} id={'abc'} />, document.getElementById('root'), function() {})
    expect(document.getElementById('abc').innerHTML).toBe('<h2></h2>')
    expect(ref.originRef.props).toEqual({ id: 'abc', children: undefined })

    ref.center.close()
    expect(document.getElementById('abc')).toBeNull()
  })

  it('should mountNodeGetter', () => {
    const Comp = mount({
      attributesGetter: props => props,
      mountNodeGetter: () => document.getElementById('root')
    })<{ id: string }>(
      class extends React.Component<any> {
        componentWillUnmount() {}
        render() {
          return <h2 />
        }
      }
    )

    ReactDOM.render(<Comp id={'abc'} />, document.getElementById('root'), function() {})
    expect(document.getElementById('abc').innerHTML).toBe('<h2></h2>')
    expect(document.getElementById('abc').parentElement).toBe(document.getElementById('root'))

    // expect(document.getElementById('abc')).toBeNull()
  })

  it('should createTimeType: decorator', () => {
    const dmount = mount({
      attributesGetter: props => props,
      createTimeType: 'decorator'
    })
    const Comp = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h2 />
        }
      }
    )

    const Comp2 = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h3 />
        }
      }
    )

    ReactDOM.render(
      <span>
        <Comp id={'abc'} />
        <Comp2 id={'abc'} />
        <Comp id={'abcd'} />
        <Comp2 id={'abcd'} />
      </span>,
      document.getElementById('root')
    )
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="root"
  >
    <span />
  </div>
  <div
    id="abcd"
  >
    <h3 />
  </div>
</body>
`)
  })

  it('should createTimeType: class', () => {
    const dmount = mount({
      attributesGetter: props => props,
      createTimeType: 'class'
    })
    const Comp = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h2 />
        }
      }
    )
    const Comp2 = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h3 />
        }
      }
    )

    ReactDOM.render(
      <span>
        <Comp id={'abc'} />
        <Comp2 id={'abc'} />
        <Comp2 id={'abcd'} />
        <Comp id={'abcd'} />
      </span>,
      document.getElementById('root')
    )
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="root"
  >
    <span />
  </div>
  <div
    id="abcd"
  >
    <h2 />
  </div>
  <div
    id="abcd"
  >
    <h3 />
  </div>
</body>
`)
  })

  it('should createTimeType: component', () => {
    const dmount = mount({
      attributesGetter: props => props,
      createTimeType: 'component'
    })
    const Comp = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h2 />
        }
      }
    )
    const Comp2 = dmount<any>(
      class extends React.Component {
        componentWillUnmount() {}
        render() {
          return <h3 />
        }
      }
    )

    ReactDOM.render(
      <span>
        <Comp id={'abc'} />
        <Comp2 id={'abc'} />
        <Comp2 id={'abcd'} />
        <Comp id={'abcd'} />
      </span>,
      document.getElementById('root')
    )
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="root"
  >
    <span />
  </div>
  <div
    id="abc"
  >
    <h2 />
  </div>
  <div
    id="abc"
  >
    <h3 />
  </div>
  <div
    id="abcd"
  >
    <h3 />
  </div>
  <div
    id="abcd"
  >
    <h2 />
  </div>
</body>
`)
  })
})
