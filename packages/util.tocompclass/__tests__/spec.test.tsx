/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import toCompClass from '../'

describe('util.toCompClass', function() {
  it('should thrown error', function() {
    expect(() => toCompClass(null)).toThrowError(
      'toComponentClass requires `component` is type of function, but object'
    )
  })
  it('should to component class', () => {
    const stateless = () => <div>123</div>
    class Comp extends React.Component {}

    expect(toCompClass(stateless)).toBeInstanceOf(Function)
    expect(toCompClass(stateless)).not.toBe(stateless)
    expect(toCompClass(stateless).displayName).toBe('stateless')

    expect(toCompClass(Comp)).toBeInstanceOf(Function)
    expect(toCompClass(Comp)).toBe(Comp)
  })
})
