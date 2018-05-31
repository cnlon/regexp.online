const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].js',
        publicPath: '/',
        globalObject: 'this'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                preserveWhitespace: false
            }
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                'postcss-loader'
            ]
        }, {
            test: /\.js$/,
            use: [
                {
                    loader: 'worker-loader',
                    options: {
                        name: '[name].js'
                    }
                },
                'babel-loader'
            ],
            include: [
                path.resolve(__dirname, '../src/worker/worker.js')
            ]
        }]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    devtool: 'eval-source-map',
    devServer: {
        host: '0.0.0.0'
    }
}
