const path = require('path')
const webpack = require('webpack')
const WebpackMd5Hash = require('webpack-md5-hash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash:6].js',
    publicPath: '/',
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
              minimize: {
                discardComments: {
                  removeAll: true
                }
              }
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new CopyWebpackPlugin([{
      from: './src/favicon.ico'
    }, {
      from: './src/share.jpg'
    }])
  ],
  devtool: 'source-map'
}
