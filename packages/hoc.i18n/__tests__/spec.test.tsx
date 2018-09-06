/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import { mount } from 'enzyme'

import i18n, { II18nComponent, II18nComponentClass, II18nProps } from '../'

describe('i18n', function() {
  it('should use normally', () => {
    const Comp = i18n<{ title?: string }>({
      title: 'Hello, World!'
    })(
      class extends React.Component<any> {
        public i: Function
        render() {
          return <h1>{this.i('title')}</h1>
        }
      }
    )

    const wrapper = mount(<Comp title={2} />)
    expect(wrapper.find('h1').text()).toBe('Hello, World!')
  })

  it('should use as decorator normally', () => {
    @(i18n({
      title: 'Hello, World!'
    }) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.props.title + this.i('title')}</h1>
      }
    }

    const wrapper = mount(<Comp title={'sss'} />)
    expect(wrapper.find('h1').text()).toBe('sssHello, World!')
  })

  it('should use in dict', () => {
    @(i18n(
      {
        'zh-cn': {
          title: '你好世界'
        },
        'en-us': {
          title: 'Hello, World!'
        }
      },
      'en-us'
    ) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.props.title + this.i('title')}</h1>
      }
    }

    const wrapper = mount(<Comp title={''} />)
    const I18nComp: any = Comp
    I18nComp.i18n.setLanguage('en-us')
    expect(wrapper.find('h1').text()).toBe('Hello, World!')

    I18nComp.i18n.setLanguage('zh-cn')
    // wrapper.update()
    wrapper.setProps({
      title: 'h'
    })
    expect(wrapper.find('h1').text()).toBe('h你好世界')

    wrapper.setProps({
      title: '',
      language: 'en-us'
    })
    expect(wrapper.find('h1').text()).toBe('Hello, World!')
    expect(I18nComp.i18n.getCurrentLanguage()).toBe('zh-cn')
  })

  it('should use in dict with locale', () => {
    @(i18n(
      {
        'zh-cn': {
          title: '你好世界'
        },
        'en-us': {
          title: 'Hello, World!'
        }
      },
      'en-us'
    ) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.props.title + this.i('title')}</h1>
      }
    }

    const wrapper = mount(<Comp title={'xx'} />)
    const I18nComp: any = Comp
    I18nComp.i18n.setLanguage('en-us')

    wrapper.setProps({
      locale: {
        title: 'locale'
      }
    })
    expect(wrapper.find('h1').text()).toBe('xxlocale')

    wrapper.setProps({
      locale: {},
      language: 'zh-cn'
    })
    expect(wrapper.find('h1').text()).toBe('xx你好世界')
    expect(I18nComp.i18n.getCurrentLanguage()).toBe('en-us')
  })
})
