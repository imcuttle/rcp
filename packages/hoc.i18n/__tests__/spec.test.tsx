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
    // @ts-ignore
    console.log(wrapper.instance().i('title'))
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

  it('should use in words with localeKey option', () => {
    @(i18n(
      {
        title: 'Hello, ${1}!'
      },
      void 0,
      { localeKey: '_locale' }
    ) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.i('title', this.props.title)}</h1>
      }
    }

    const wrapper = mount(<Comp title={'xx'} />)
    const I18nComp: any = Comp

    wrapper.setProps({
      _locale: {
        title: 'Hi, ${1}!'
      },
      language: 'zh-cn'
    })
    expect(wrapper.find('h1').text()).toBe('Hi, xx!')
  })

  it('should use in words with languageKey option', () => {
    @(i18n(
      {
        en: {
          title: 'Hello, ${1}!'
        },
        zh: {
          title: '你好, ${1}!'
        }
      },
      'en',
      { languageKey: '_lang' }
    ) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.i('title', this.props.title)}</h1>
      }
    }

    const wrapper = mount(<Comp title={'xx'} />)
    const I18nComp: any = Comp

    wrapper.setProps({
      language: 'zh'
    })
    expect(wrapper.find('h1').text()).toBe('Hello, xx!')
    wrapper.setProps({
      _lang: 'zh'
    })
    expect(wrapper.find('h1').text()).toBe('你好, xx!')
  })

  it('should thrown error when Component is not belongs to React Component Class', function() {
    const obj = {} as React.ComponentClass
    expect(() => i18n()(obj)).toThrowErrorMatchingInlineSnapshot(
      `"(@rcp/hoc.i18n): \`Component\` should be a React ComponentClass. but typeof object"`
    )
  })

  it('should use in extends', () => {
    @(i18n({
      title: 'Hello, ${1}!'
    }) as any)
    class Comp extends React.Component<{ title: string } & II18nProps> {
      public i: Function
      render() {
        return <h1>{this.i('title', this.props.title)}</h1>
      }
    }

    let wrapper = mount(<Comp title={'xx'} />)
    expect(wrapper.find('h1').text()).toBe('Hello, xx!')

    class NewComp extends Comp {}
    wrapper = mount(<NewComp title={'xx'} />)
    expect(wrapper.find('h1').text()).toBe('Hello, xx!')

    @(i18n({
      title: 'WrapComp, ${1}!'
    }) as any)
    class WrapComp extends Comp {}
    wrapper = mount(<WrapComp title={'xx'} />)
    expect(wrapper.find('h1').text()).toBe('WrapComp, xx!')
  })
})
