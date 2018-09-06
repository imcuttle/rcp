/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */
import displayName from '../'
import * as React from 'react'
import { IFunction } from '../../_internal'
import { func } from 'prop-types'

describe('displayName', function() {
  it('should return self when component is string', () => {
    expect(displayName('')).toBe('')
    expect(displayName('123')).toBe('123')
  })

  it('should return stringify when component is nil', () => {
    expect(displayName(null)).toBe('null')
    expect(displayName(undefined)).toBe('undefined')
  })

  it('should return displayName when component is ComponentClass', () => {
    class CusComp extends React.Component {
      static displayName = 'CusDisplayName'
      render() {
        return <div>123</div>
      }
    }
    class CusComp2 extends React.PureComponent {
      static displayName = 'CusDisplayName'
      render() {
        return <div>123</div>
      }
    }
    expect(displayName(CusComp)).toBe('CusDisplayName')
    expect(displayName(CusComp2)).toBe('CusDisplayName')
  })

  it('should return name when component is StatelessClass', () => {
    const CusComp: IFunction = () => <div>123</div>
    expect(displayName(CusComp)).toBe('CusComp')
    function CusDisplayName() {
      return null
    }
    expect(displayName(CusDisplayName)).toBe('CusDisplayName')
  })

  it('should return name when component is StatelessClass even displayName is preset', () => {
    const CusComp: any = () => <div>123</div>
    CusComp.displayName = '123'
    expect(displayName(CusComp)).toBe('CusComp')
  })
})
