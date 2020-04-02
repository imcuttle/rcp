const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {

  },
  context: __dirname,
  entry: './example/index',
  resolve: {
    extensions: [
      '.tsx', '.ts',
      '.wasm', '.mjs', '.js', '.json'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './example/index.html'
    })
  ]
}
