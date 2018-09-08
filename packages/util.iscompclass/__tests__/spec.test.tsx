/**
 * @file spec
 * @author imcuttle
 * @description
 */
import * as React from 'react'
import * as createClass from 'create-react-class'
import isComponentClass from '../'

describe('util.isComponentClass', function() {
  it('should spec', () => {
    class Comp extends React.Component {}
    const MyComp = createClass({
      render() {
        return null
      }
    })

    const StatelessComp = () => <div />
    expect(isComponentClass(<div>div</div>)).toBeFalsy()
    expect(isComponentClass(Comp)).toBeTruthy()
    expect(isComponentClass(<Comp />)).toBeFalsy()
    expect(isComponentClass(MyComp.prototype)).toBeFalsy()
    expect(isComponentClass(MyComp)).toBeTruthy()
    expect(isComponentClass(StatelessComp)).toBeFalsy()
  })

  it('should plainObj', function() {
    const p = () => {}
    p.prototype.isReactComponent = null
    expect(isComponentClass(p)).toBeFalsy()
    p.prototype.isReactComponent = []
    expect(isComponentClass(p)).toBeFalsy()
    p.prototype.isReactComponent = new Boolean(false)
    expect(isComponentClass(p)).toBeFalsy()
    p.prototype.isReactComponent = {}
    expect(isComponentClass(p)).toBeTruthy()
  })
})
