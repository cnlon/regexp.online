const path = require('path')

module.exports = {
    entry: {
        app: [
            './src/index.js',
            'normalize.css',
            './src/css/index.css',
        ],
        vendor: [
            'core-js/shim',
            'vue',
        ],
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../editor')
            ]
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(ico|png|woff2)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }]
    }
}
