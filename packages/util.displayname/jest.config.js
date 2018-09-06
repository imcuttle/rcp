/**
 * @file jest.config.js
 * @author Cuttle Cong
 * @date 2018/9/6
 *
 */
const base = require('../../package').jest
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: '../..'
  // testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
}
