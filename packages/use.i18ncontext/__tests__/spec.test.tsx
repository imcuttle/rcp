/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import { render, mount } from 'enzyme'
import { createIsolateI18n } from 'tiny-i18n'
import { UseI18nOptions } from '@rcp/use.i18n'
import useI18n, { I18nProvider, I18nConsumer, withTinyI18n, useI18nContext } from '../index'

function Demo({ language = 'zh-cn', locale }: UseI18nOptions) {
  const { i18n } = useI18n(
    {
      'zh-cn': {
        title: '标题',
        content: '${1} 正文'
      },
      en: {
        title: 'Title',
        content: '${1} Content'
      }
    },
    {
      language,
      locale
    }
  )

  return <p>{i18n('content', i18n('title'))}</p>
}

describe('useI18nContext', function() {
  describe('standalone', function() {
    it('should use i18n', () => {
      const wrapper = mount(<Demo />)
      expect(wrapper.html()).toMatchInlineSnapshot(`"<p>标题 正文</p>"`)

      wrapper.setProps({
        language: 'en'
      })
      expect(wrapper.html()).toMatchInlineSnapshot(`"<p>Title Content</p>"`)

      expect(render(<Demo language={'en'} />).text()).toMatchInlineSnapshot(`"Title Content"`)
    })

    it('should locale', () => {
      const wrapper = mount(<Demo locale={{ title: 'lalala' }} />)
      expect(wrapper.text()).toMatchInlineSnapshot(`"lalala 正文"`)

      wrapper.setProps({
        language: 'en'
      })
      expect(wrapper.html()).toMatchInlineSnapshot(`"<p>lalala Content</p>"`)

      wrapper.setProps({
        locale: {}
      })
      expect(wrapper.html()).toMatchInlineSnapshot(`"<p>lalala Content</p>"`)

      wrapper.setProps({
        locale: {
          title: '标题1',
          content: 'Content ${1}'
        }
      })
      expect(wrapper.html()).toMatchInlineSnapshot(`"<p>Content 标题1</p>"`)
    })
  })

  describe('withContext', function() {
    const tinyI18n = createIsolateI18n()
    tinyI18n.setDictionary(
      {
        name: '姓名',
        age: '年纪'
      },
      'zh'
    )
    tinyI18n.setDictionary(
      {
        name: 'Name',
        age: 'Age'
      },
      'en'
    )

    function App({ children, language = 'en' }) {
      return (
        <I18nProvider
          tinyI18n={tinyI18n}
          language={language}
          locale={{
            age: 'Override Age'
          }}
        >
          {children}
        </I18nProvider>
      )
    }

    function View() {
      const { i18n } = useI18n({})
      return (
        <h1>
          {i18n('name')},{i18n('age')}
        </h1>
      )
    }

    function OverrideView({ locale, language }: any) {
      const { i18n, getDataBase } = useI18n(
        {
          en: {
            name: 'Name from OverrideView',
            age: 'Age from OverrideView'
          }
        },
        { locale, language }
      )
      return (
        <h1>
          {i18n('name')},{i18n('age')}
        </h1>
      )
    }

    it('should render View', function() {
      const wrapper = mount(
        <App>
          <View />
        </App>
      )
      expect(wrapper.text()).toMatchInlineSnapshot(`"Name,Override Age"`)
    })

    it('should render OverrideView', function() {
      let wrapper = mount(
        <App>
          <OverrideView />
          <View />
        </App>
      )
      expect(wrapper.text()).toMatchInlineSnapshot(
        `"Name from OverrideView,Age from OverrideViewName from OverrideView,Age from OverrideView"`
      )

      wrapper = mount(
        <App>
          <View />
          <OverrideView locale={{ name: '_name', age: '_age' }} />
        </App>
      )
      expect(wrapper.text()).toMatchInlineSnapshot(`"Name from OverrideView,Override Age_name,_age"`)
    })

    it('should render Nested', function() {
      function OverrideView({ locale }: any) {
        const { i18n, getDataBase } = useI18n(
          {
            en: {
              name: 'Name from OverrideView',
              age: 'Age from OverrideView'
            }
          },
          { locale }
        )
        console.log(getDataBase())
        return (
          <h1>
            {i18n('name')},{i18n('age')}
          </h1>
        )
      }

      let wrapper = mount(
        <App>
          <OverrideView />
        </App>
      )
      expect(wrapper.text()).toMatchInlineSnapshot(`"Name,Override Age"`)

      wrapper = mount(
        <App>
          <OverrideView locale={{ age: '_age' }} />
        </App>
      )
      expect(wrapper.text()).toMatchInlineSnapshot(`"Name,_age"`)
    })

    it('should nested', function() {
      const wrapper = mount(<OverrideView language={'en'} locale={{ age: '_age' }} />)
      expect(wrapper.text()).toMatchInlineSnapshot(`"Name from OverrideView,_age"`)
    })
  })
})
