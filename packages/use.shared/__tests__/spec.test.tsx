/**
 * @file spec
 * @author 余聪
 * @description
 */
import React = require('react')
import { mount } from 'enzyme'
import { SharedProvider, useShared, useSharedProvider } from '..'

const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 100, {
      name: '小红'
    })
  })
}

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const Content = React.memo(({ symbol = fetchData }: any) => {
  // 必须使用唯一方法 ref，孩子获取数据
  const [data] = useShared(symbol)
  return <pre>{JSON.stringify(data, null, 2)}</pre>
})

const syncData = {
  wow: 123
}
const Layout = ({ symbol = syncData }: any) => {
  useSharedProvider(symbol)
  return (
    <>
      <Content symbol={symbol} />
      <NoEffectComp />
    </>
  )
}

const NoEffect = jest.fn(() => {
  return null
})
const NoEffectComp = React.memo(NoEffect)

const App = ({ symbol }: any) => {
  // RootValuesProvider 用于提供共享数据存储载体，一般在 React Element Root 注入
  return (
    <SharedProvider>
      <Layout symbol={symbol} />
    </SharedProvider>
  )
}

describe('useShared', function () {
  afterEach(() => {
    NoEffect.mockClear()
  })

  it('should spec', () => {
    const ins = mount(<App />)
    expect(NoEffect).toHaveBeenCalledTimes(1)
    expect(ins.html()).toMatchInlineSnapshot(`
"<pre>{
  \\"wow\\": 123
}</pre>"
`)
  })
  it('should spec 2', async () => {
    const ins = mount(<App symbol={() => ({ data: {}, page: {} })} />)
    expect(NoEffect).toHaveBeenCalledTimes(1)
    await delay(100)
    expect(NoEffect).toHaveBeenCalledTimes(1)
    expect(ins.html()).toMatchInlineSnapshot(`
"<pre>{
  \\"data\\": {},
  \\"page\\": {}
}</pre>"
`)
  })

  it('should spec 3', async () => {
    const ins = mount(<App symbol={fetchData} />)
    expect(NoEffect).toHaveBeenCalledTimes(1)
    await delay(100)

    expect(NoEffect).toHaveBeenCalledTimes(1)
    expect(ins.html()).toMatchInlineSnapshot(`
"<pre>{
  \\"name\\": \\"小红\\"
}</pre>"
`)
  })
})
