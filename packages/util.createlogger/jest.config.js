/**
 * @file jest.config.js
 * @author imcuttle
 *
 */
const base = require('../../../package').jest
const pack = require('./package')

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: '../..',
  testEnvironment: 'node'
  // testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
}
