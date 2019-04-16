/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import hocUncontrolled from '../'
import { mount } from 'enzyme'

describe('hocUncontrolled', function() {
  it('should spec', () => {
    @hocUncontrolled(['value'])
    class View extends React.Component<any> {
      static defaultProps? = {}
      state: any

      render() {
        return this.state.value || ''
      }
    }
    const AnyView = View as any

    expect(AnyView.displayName).toBe('Uncontrolled_View')

    let wrapper = mount(<AnyView />)
    expect(wrapper.text()).toBe('')

    wrapper = mount(<AnyView defaultValue={'val'} />)
    expect(wrapper.text()).toBe('val')
    wrapper.setProps({
      defaultValue: 'xxx'
    })
    expect(wrapper.text()).toBe('val')
    wrapper.setProps({
      value: 'xxx'
    })
    expect(wrapper.text()).toBe('xxx')
  })

  it('should opt.withDefault', () => {
    @hocUncontrolled([{ name: 'value', withDefault: false }])
    class View extends React.Component {
      static defaultProps? = {}
      state: any

      render() {
        return this.state.value || ''
      }
    }
    const AnyView = View as any

    let wrapper = mount(<AnyView value={'xxxy'} />)
    expect(wrapper.text()).toBe('xxxy')

    wrapper = mount(<AnyView defaultValue={'val'} />)
    expect(wrapper.text()).toBe('')
    wrapper.setProps({
      value: 'abc',
      defaultValue: 'xxx'
    })
    expect(wrapper.text()).toBe('abc')
    wrapper.setProps({
      value: 'xxx'
    })
    expect(wrapper.text()).toBe('xxx')
  })

  it('should opt.eq', () => {
    @hocUncontrolled([{ name: 'value', eq: (a, b) => a.k === b.k }])
    class View extends React.Component {
      static defaultProps? = {}
      state: {
        value: any
      }

      render() {
        return this.state.value.label || ''
      }
    }
    const AnyView = View as any

    let wrapper = mount(<AnyView value={{ k: '1', label: 'a' }} />)
    expect(wrapper.text()).toBe('a')

    // setValue failed
    wrapper.setProps({
      value: { k: '1', label: 'hahah' }
    })
    expect(wrapper.text()).toBe('a')
    expect((wrapper.state() as any).value).toEqual({ k: '1', label: 'a' })

    wrapper.setProps({
      value: { k: '2', label: 'a' }
    })
    expect((wrapper.state() as any).value).toEqual({ k: '2', label: 'a' })
    wrapper.setProps({
      value: { k: '1', label: 'hahah' }
    })
    expect((wrapper.state() as any).value).toEqual({ k: '1', label: 'hahah' })
  })
})
