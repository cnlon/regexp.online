const webpack = require('webpack')

module.exports = {
  output: {
    path: './build',
    filename: '[name].js',
    publicPath: '/build/',
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'vue-style!css!postcss',
    }],
  },
  vue: {
    loaders: {
      css: 'vue-style!css!postcss',
    },
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  devtool: 'eval',
  devServer: {
    historyApiFallback: {
      rewrites: [{
        from: /^\/$/,
        to: '/build/',
      }],
    },
    noInfo: true,
  },
}
