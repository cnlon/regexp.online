module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/css/index.css',
    ],
    vendor: [
      'core-js/shim',
      'vue',
      'normalize.css',
    ],
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue',
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  postcss: function (pack) {
    return [
      require('postcss-import')({addDependencyTo: pack}),
      require('postcss-cssnext'),
    ]
  },
  babel: {
    presets: [
      ['es2015', {'loose': true}],
      'stage-2',
    ],
    plugins: [
      ['transform-builtin-extend', {globals: ['Array'], approximate: true}],
    ],
  },
}
