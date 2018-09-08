/**
 * @file filter
 * @author Cuttle Cong
 * @date 2018/9/7
 *
 */
const nps = require('path')
const merge = require('lodash.merge')
const fs = require('fs')
const filter = require('./filter')
;(async () => {
  const paths = await filter()

  paths.forEach(path => {
    const pkg = require(nps.join(path, 'package.json'))

    const newPkg = merge({}, pkg, {})

    fs.writeFileSync(path, JSON.stringify(newPkg, null, 2))
  })
  console.warn(paths)
})()
