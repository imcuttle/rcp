'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file spec
 * @author imcuttle
 * @description
 */
process.env.DEBUG = 'scope'
var __1 = require('../')
describe('logger', function() {
  it('should format', function() {
    var c = __1.default()
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s %o', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })
  it('should format with scope', function() {
    var c = __1.default('scope')
    expect(c.format({ message: 'msss', type: 'aa', argv: [] })).toMatchSnapshot()
    expect(c.format({ message: 'msss:%s %o', type: 'aa', argv: ['abc', { ac: 'sss' }] })).toMatchSnapshot()
  })
  it('should debug with scope', function() {
    var c = __1.default('scope')
    c.log('saa%s + %s', 'as', 'ssw')
    c.warn('saa%s + %s', 'as', 'ssw')
    c.error('saa%s + %s', 'as', 'ssw')
    c.debug('saa%s + %s', 'as', 'ssw')
  })
})
//# sourceMappingURL=spec.test.js.map
