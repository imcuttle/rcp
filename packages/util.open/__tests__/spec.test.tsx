/**
 * @file spec
 * @author 余聪
 * @description
 */
import * as React from 'react'
import { promiseStateSync } from 'p-state'
import utilOpen, { createOpenReactStandalone } from '../'

describe('utilOpen', function() {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should open', () => {
    const p = utilOpen(close => (
      <h1 id={'close-me'} onClick={close}>
        title
      </h1>
    ))

    expect(Object.keys(p)).toEqual(['close', 'open', 'containerDOM'])
    expect(p instanceof Promise).toBeTruthy()
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller\\"><div><h1 id=\\"close-me\\">title</h1></div></div>"`
    )

    expect(promiseStateSync(p)).toBe('pending')
    // @ts-ignore
    document.querySelector('#close-me').click()
    expect(promiseStateSync(p)).toBe('fulfilled')
    expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div class=\\"modal-open-controller\\"></div>"`)

    utilOpen.remove()
    expect(document.body.innerHTML).toMatchInlineSnapshot(`""`)
  })

  it('should open multiply', async () => {
    const open = createOpenReactStandalone()

    const p = open(close => (
      <h1 id={'close-me'} onClick={close}>
        title
      </h1>
    ))

    open(close => (
      <h1 id={'close-me-2'} onClick={close}>
        title
      </h1>
    ))
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div class=\\"modal-open-controller\\"><div><h1 id=\\"close-me-2\\">title</h1></div></div>"`
    )

    // @ts-ignore
    document.querySelector('#close-me-2').click()
    expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div class=\\"modal-open-controller\\"></div>"`)
  })
})
