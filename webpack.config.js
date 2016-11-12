const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack/base.js')

const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_DEBUG = NODE_ENV !== 'production'

module.exports = merge(
  base,
  IS_DEBUG ? require('./webpack/dev.js') : require('./webpack/build.js'),
  {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.APP_NAME': JSON.stringify('RegExp online'),
        'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
        'process.env.APP_LINK': JSON.stringify('https://github.com/cnlon/regexp.online'),
      })
    ]
  }
)
