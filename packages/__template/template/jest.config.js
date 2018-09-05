/**
 * @file jest.config.js
 * @author {{{_.git.name}}}
 *
 */
const base = require('../../../package').jest
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: '../..'
  // testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
}
