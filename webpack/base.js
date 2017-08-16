const path = require('path')

module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/css/index.css',
    ],
    vendor: [
      'core-js/shim',
      'vue',
      'normalize.css',
    ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.resolve(__dirname, '../src'),
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
}
