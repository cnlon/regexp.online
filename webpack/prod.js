const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'

module.exports = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash:6].js',
        publicPath: PUBLIC_PATH,
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                extractCSS: true,
                preserveWhitespace: false
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
        }, {
            test: /\.js$/,
            use: [
                {
                    loader: 'worker-loader',
                    options: {
                        name: '[name].[chunkhash:6].js',
                        inline: true
                    }
                },
                'babel-loader',
            ],
            include: [
                path.resolve(__dirname, '../src/worker/worker.js')
            ]
        }],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin('[name].[contenthash:6].css'),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],
    devtool: 'source-map'
}
