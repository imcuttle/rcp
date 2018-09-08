/**
 * @file spec
 * @author imcuttle
 * @description
 */
process.env.DEBUG = 'scope'
import createLogger from '../node'
import browserCreateLogger from '../browser'

describe('logger', function() {
  it('should format', () => {
    const c = createLogger()
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s ', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })

  it('should format with scope', () => {
    const c = createLogger('scope')
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s ', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })

  it('should debug with scope', () => {
    const c = createLogger('scope')
    c.log('saa%s + %s', 'as', 'ssw')
    c.warn('saa%s + %s', 'as', 'ssw')
    c.error('saa%s + %s', 'as', 'ssw')
    c.success('saa%s + %s', 'as', 'ssw')
    c.debug('saa%s + %s', 'as', 'ssw')
  })

  it('should format in browserCreateLogger', () => {
    const c = browserCreateLogger()
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s ', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })

  it('should format with scope in browserCreateLogger', () => {
    const c = browserCreateLogger('scope')
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s ', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })

  it('should debug with scope in browserCreateLogger', () => {
    const c = browserCreateLogger('scope', { prefix: '[', suffix: ']' })
    c.log('saa%s + %s', 'as', 'ssw')
    c.warn('saa%s + %s', 'as', 'ssw')
    c.error('saa%s + %s', 'as', 'ssw')
    c.success('saa%s + %s', 'as', 'ssw')
    c.success({ a: '222' }, 'ok')
    c.debug('saa%s + %s', 'as', 'ssw')
  })
})
