/**
 * @file jest.config
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/4/17
 *
 */
const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  name: require('./package').name,
  displayName: require('./package').name,
  testMatch: [`${__dirname}/__tests__/**/*.{spec,test}.ts{x,}`],
  rootDir: "../..",
};
