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
    if (name.startsWith('@rcp/_') || val.pkg.private) {
      return
    }
    strings.push(`- [${name}](${nps.relative(cwd, val.path)}) - ${val.pkg.description}  `)
  })

  const readmePath = nps.join(cwd, 'README.md')
  const readme = fs.readFileSync(readmePath, { encoding: 'utf8' })
  const newReadme = readme.replace(/(?<=\n## Packages)[^]*?(?=\n#+ )/, () => {
    return '\n\n' + strings.join('\n') + '\n\n'
  })

  if (newReadme !== readme) {
    fs.writeFileSync(readmePath, newReadme)
  }
})()
