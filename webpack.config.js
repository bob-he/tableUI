/*eslint-disable*/
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './examples/table.jsx'
  ],
  output: {
    filename: './examples/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  resolve:{
    extensions:['', '.js', '.json']
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
}
