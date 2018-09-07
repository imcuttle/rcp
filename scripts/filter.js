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
;(async () => {
  const cwd = nps.join(__dirname, '..')
  const paths = await globby(require('../lerna').packages, {
    cwd,
    onlyDirectories: true
  })

  const packageJsonPaths = paths.map(path => nps.join(path, 'package.json'))

  packageJsonPaths.forEach(path => {
    path = nps.join(cwd, path)
    const pkg = require(path)
    const newPkg = merge({}, pkg, {
      // scripts: {
      //   prepare: 'npm run dist',
      //   prepublishOnly: 'npm test && npm run doc'
      // },
      // devDependencies: {
      //   react: '^16.4.2'
      // }
    })

    delete newPkg.devDependencies.react
    delete newPkg.devDependencies.typescript

    fs.writeFileSync(path, JSON.stringify(newPkg, null, 2))
  })
  console.warn(paths)
})()
