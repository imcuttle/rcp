/**
 * @file spec
 * @author 余聪
 * @description
 */
import * as React from 'react'
import { createHashHistory, createMemoryHistory } from 'history'
import { Route, Router } from 'react-router'
import { mount } from 'enzyme'
import Prompt, { PromptConsumer, PromptProvider } from '../index'

const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

describe('Prompt', function() {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('Spec', async () => {
    const when = jest.fn((prev, next) => {
      console.log(JSON.stringify({ prev, next }, null, 2))
      return true
    })

    const history = createMemoryHistory()
    const instance = mount(
      <Router history={history}>
        <PromptProvider>
          <Prompt when={when} message={'Prompt Message'}>
            <div>message</div>
          </Prompt>
        </PromptProvider>
      </Router>
    )

    console.log(instance.html())
    expect(when).not.toHaveBeenCalled()

    history.push('/a')
    // await delay(100)
    expect(when.mock.calls.length).toBe(1)
    expect(when.mock.calls[0]).toMatchObject([
      'locationUpdate',
      {
        prev: {
          location: { pathname: '/' },
          action: 'POP'
        },
        next: {
          location: { pathname: '/a' },
          action: 'PUSH'
        }
      }
    ])
  })

  it('Custom Spec', async () => {
    const when = jest.fn((prev, next) => {
      return true
    })

    const getPromptComponent = jest.fn(({ message, close }) => (
      <div className={'modal'}>
        <p>{message}</p>
        <button id={'confirm'} onClick={() => close(true)}>
          confirm
        </button>
        <button id={'cancel'} onClick={() => close(false)}>
          cancel
        </button>
      </div>
    ))

    const history = createMemoryHistory()
    const instance = mount(
      <Router history={history}>
        <PromptProvider getPromptComponent={getPromptComponent}>
          <Prompt when={when} message={'Prompt Message'}>
            <div>message</div>
          </Prompt>
        </PromptProvider>
      </Router>
    )

    const listen = jest.fn(() => {})
    history.listen(listen)
    expect(getPromptComponent).not.toHaveBeenCalled()
    expect(document.body.innerHTML).toMatchInlineSnapshot(`""`)

    history.push('/a')
    // await delay(100)
    expect(getPromptComponent.mock.calls.length).toBe(1)
    expect(getPromptComponent.mock.calls[0]).toMatchObject([
      {
        message: 'Prompt Message'
      }
    ])
    expect(listen.mock.calls).toEqual([])
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller rcp-prompt-mount-container\\"><div><div class=\\"modal\\"><p>Prompt Message</p><button id=\\"confirm\\">confirm</button><button id=\\"cancel\\">cancel</button></div></div></div>"`
    )

    // @ts-ignore
    document.querySelector('#cancel').click()
    await delay()
    expect(listen.mock.calls).toEqual([])
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller rcp-prompt-mount-container\\"></div>"`
    )

    history.push('/b')
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller rcp-prompt-mount-container\\"><div><div class=\\"modal\\"><p>Prompt Message</p><button id=\\"confirm\\">confirm</button><button id=\\"cancel\\">cancel</button></div></div></div>"`
    )
    // @ts-ignore
    document.querySelector('#confirm').click()
    await delay()
    expect(listen.mock.calls).toMatchObject([[{ pathname: '/b' }, 'PUSH']])
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller rcp-prompt-mount-container\\"></div>"`
    )
  })
})
