# rcp

[![build status](https://img.shields.io/travis/imcuttle/rcp/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/rcp)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/rcp.svg?style=flat-square)](https://codecov.io/github/imcuttle/rcp?branch=master)

<!--[![NPM version](https://img.shields.io/npm/v/rcp.svg?style=flat-square)](https://www.npmjs.com/package/rcp)
[![NPM Downloads](https://img.shields.io/npm/dm/rcp.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/rcp)-->

Anything about React Component

## Develop

```bash
git clone https://github.com/imcuttle/rcp.git
cd rcp
npm install
```

### New a package

Use [edam](https://github.com/imcuttle/edam) for generating.

```bash
npm run new
# Or use edam-cli in straightway
npm i edam-cli -g
edam
```

#### About package name

- internal package

should be named as `_foo`, eg. `@rp/_types`.

- utility package

should be named as `util.{{lowerCase}}`, eg. `@rp/util.displayname`.

- hoc package

should be named as `hoc.{{lowerCase}}`, eg. `@rp/hoc.i18n`.

- component package

should be named as `c.{{lowerCase}}`, eg. `@rp/c.text`.

## Related

## Authors

This library is written and maintained by imcuttle, [moyuyc95@gmail.com](mailto:moyuyc95@gmail.com).

## License

MIT
