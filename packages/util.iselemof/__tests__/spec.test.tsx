/**
 * @file spec
 * @author imcuttle
 * @description
 */
import isElementOf from '../'
import * as React from 'react'

describe('util.isElementOf', function() {
  it('should ', () => {
    class Comp extends React.Component {}
    class CompOther extends React.Component {}
    expect(isElementOf(Comp)(<Comp />)).toBeTruthy()
    expect(isElementOf(Comp)(<CompOther />)).toBeFalsy()
  })
})
