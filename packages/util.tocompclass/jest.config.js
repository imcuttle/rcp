/**
 * @file jest.config.js
 * @author imcuttle
 *
 */
const base = require('../../package.json').jest
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: '../..'
  // testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
}
