module.exports = function (webpack) {
    return {
        plugins: {
            'postcss-import': require('postcss-import')({
                addDependencyTo: webpack
            }),
            'postcss-url': require('postcss-url')(),
            'postcss-cssnext': require('postcss-cssnext')(),
        }
    }
}
