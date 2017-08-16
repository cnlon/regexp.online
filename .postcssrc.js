module.exports = function (webpack) {
  return {
    plugins: {
      'postcss-import': require('postcss-import')({
        addDependencyTo: webpack
      }),
      'postcss-cssnext': require('postcss-cssnext')()
    }
  }
}
