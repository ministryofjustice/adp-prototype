var webpack = require("webpack");

module.exports = {
  entry: {
    app: './source/javascripts/main.js',
    polyfills: ['JSON2', 'html5shiv']
  },
  output: {
    path: './source/javascripts',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { include: /\.json$/, loaders: ['json-loader'] },
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      'node_modules/mojular/node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.DedupePlugin()
  ]
};
