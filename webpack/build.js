const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    path: './dist',
    filename: '[name].[chunkhash:6].js',
    publicPath: 'dist/',
    devtoolModuleFilenameTemplate: info => info.resource,
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css!postcss'),
    }],
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract('css!postcss'),
    },
  },
  plugins: [
    new ExtractTextPlugin('[name].[chunkhash:6].css'),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
  ],
  devtool: 'source-map',
}
