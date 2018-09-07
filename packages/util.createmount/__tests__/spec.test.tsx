/**
 * @file spec
 * @author imcuttle
 * @description
 */
import createMountCenter from '../'
import * as React from 'react'

describe('util.createMountCenter', function() {
  let center
  let getNode
  beforeEach(function() {
    center = createMountCenter({
      element: <div id="center">222</div>,
      attributes: { id: 'container' }
    })
    getNode = () => document.getElementById('container')
  })
  afterEach(function() {
    center.close()
  })
  it('should spec', () => {
    expect(getNode()).toBeNull()
    center.open()
    expect(getNode().parentElement).toBe(document.body)

    center.close()
    expect(getNode()).toBeNull()
  })

  it('should open multi-times', function() {
    document.body.innerHTML = `
    <div id="root"></div>
    `
    expect(getNode()).toBeNull()

    center.open()
    expect(getNode().parentElement).toBe(document.body)
    center.open({
      element: <h1>123</h1>,
      mountNode: document.getElementById('root'),
      attributes: {
        id: 'container',
        className: 'class'
      }
    })
    expect(getNode().parentElement).toBe(document.body)
    expect(getNode().className).toBe('class')
    expect(getNode().innerHTML).toBe('<h1>123</h1>')

    center.close()
    center.open({
      element: <h1>123</h1>,
      mountNode: document.getElementById('root'),
      attributes: {
        id: 'container',
        className: 'class'
      }
    })
    expect(getNode().parentElement).toBe(document.getElementById('root'))
    expect(getNode().className).toBe('class')
  })
})
