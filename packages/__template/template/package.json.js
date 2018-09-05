// @loader module?indent=2

module.exports = ({ _, name, description }) => {
  return {
    name: `@rcp/${name}`,
    author: _.git.name,
    description: description,
    publishConfig: {
      access: 'public'
    },
    license: 'MIT',
    scripts: {
      dist: 'tsc',
      dev: 'npm run dist -- -w',
      prepublishOnly: 'npm test && npm run doc',
      test: 'jest',
      doc:
        'documentation --github --markdown-toc=false readme index.js -a public -s "API" && git commit -am "chore: update readme"'
    },
    keywords: [_.git.name, name],
    engines: {
      node: '>=6'
    },
    main: 'index.js',
    typings: 'index.d.js',
    version: '1.0.0'
  }
}
