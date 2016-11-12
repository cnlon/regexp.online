const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    new HtmlWebpackPlugin({template: 'src/index.html'}),
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
