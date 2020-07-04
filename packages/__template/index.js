/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 *
 */
const nps = require('path')

module.exports = edam => {
  return {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "Please input your package's name",
        validate(val) {
          if (!val) {
            return "package's name is required!"
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'description',
        message: "Please input your package's description",
        default: ''
      }
    ],

    process({ name }) {
      edam.config.output = nps.join(edam.config.output, name)
      const isComponent = name.startsWith('c.')

      const move = {
        'gitignore': '.gitignore',
        'npmignore': '.npmignore',
        'package.json.js': 'package.json'
      }

      if (isComponent) {
        move['index.ts'] = 'index.tsx';
        move['__tests__/spec.test.ts'] = '__tests__/spec.test.tsx';
      }

      return {
        ignore: [
          !isComponent && 'example/**',
          !isComponent && 'webpack.config.js',
        ].filter(Boolean),
        move
      }
    }
  }
}
