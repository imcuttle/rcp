// @loader module?indent=2

module.exports = ({ _, name, description }) => {
  const isComponent = name.startsWith('c.')
  const pkg = {
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
      prepublishOnly: 'npm run dist',
      version: 'npm run doc',
      doc: 'documentation --markdown-toc=false readme index.js -a public -s "API" && git add README.md'
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/imcuttle/rcp.git'
    },
    keywords: [_.git.name].concat(name.split('.')).concat('react', 'rcp'),
    engines: {
      node: '>=6'
    },
    main: 'index.js',
    typings: 'index.d.js',
    version: '1.0.0'
  }
  if (isComponent) {
    pkg.scripts.example = 'webpack '
  }

  return pkg;
}
