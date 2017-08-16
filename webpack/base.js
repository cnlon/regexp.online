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
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        preserveWhitespace: false
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, '..', 'src')
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }]
  }
}
