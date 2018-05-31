const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')

module.exports = {
    entry: {
        vendor: [
            'vue',
            'lodash-es/throttle',
        ],
        shim: 'core-js/shim',
        app: [
            './src/index.js',
            'normalize.css',
            './src/css/index.css',
        ],
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../editor')
            ],
            exclude: [
                path.resolve(__dirname, '../src/worker/worker.js')
            ]
        }, {
            test: /\.(svg|ico|png|woff2)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
