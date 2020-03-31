/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import { shallow, render, mount } from 'enzyme'
import useI18n, { UseI18nOptions } from '../index'

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

describe('useI18n', function() {
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
