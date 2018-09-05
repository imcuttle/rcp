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
      return {
        move: {
          'package.json.js': 'package.json'
        }
      }
    }
  }
}
