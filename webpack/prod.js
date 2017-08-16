const path = require('path')
const webpack = require('webpack')
const WebpackMd5Hash = require('webpack-md5-hash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash:6].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        extractCSS: true
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true
            }
          },
          'postcss-loader'
        ]
      }),
    }],
  },
  plugins: [
    new WebpackMd5Hash(),
    new ExtractTextPlugin('[name].[contenthash:6].css'),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
  ],
  devtool: 'source-map'
}
