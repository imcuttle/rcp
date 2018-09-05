/**
 * @file spec
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */
import displayName from '../'

describe('displayName', function() {
  it('should return self when component is string', () => {
    expect(displayName('')).toBe('')
    expect(displayName('123')).toBe('123')
  })

  it('should return stringify when component is nil', () => {
    expect(displayName(null)).toBe('null')
    expect(displayName(undefined)).toBe('undefined')
  })

  it('should return stringify when component is nil', () => {
    expect(displayName(null)).toBe('null')
    expect(displayName(undefined)).toBe('undefined')
  })
})
