/**
 * @file gen-readme
 * @author Cuttle Cong
 * @date 2018/9/8
 */
const nps = require('path')
const each = require('lodash.foreach')
const fs = require('fs')
const filter = require('./filter')
;(async () => {
  const cwd = nps.join(__dirname, '..')
  const paths = await filter()
  console.warn(paths)

  const data = {}
  paths.forEach(path => {
    const pkg = require(nps.join(path, 'package.json'))
    data[pkg.name] = {
      pkg,
      path
    }
  })

  const strings = []
  each(data, (val, name) => {
    strings.push(`- [${name}](${nps.relative(cwd, val.path)}) - ${val.pkg.description}  `)
  })

  const readme = fs.readFileSync(nps.join(__dirname, '../README.md'), { encoding: 'utf8' })
  readme.replace(/<!--\s*?Packages\s*?-->/, () => {
    return strings.join('\n')
  })
})()
