/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/9/7
 *
 */
const globby = require('globby')
const nps = require('path')
const merge = require('lodash.merge')
const fs = require('fs')

module.exports = async function filter() {
  const cwd = nps.join(__dirname, '..')
  const paths = await globby(require('../lerna').packages, {
    cwd,
    onlyDirectories: true
  })

  return paths.map(path => nps.join(cwd, path))
}
