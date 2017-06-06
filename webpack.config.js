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
      { test: /\.css$/, loader: "style!css" },
      // {
      //   test: /\.(png|jpg|jpeg|gif)$/i,
      //   // name严格输出文件到本地目录，但是会导致css内的图片、字体资源路径不对
      //   loader: 'url-loader?limit=1024&name=../src/[hash].[ext]'
      // },
      // // file-loader https://github.com/webpack/file-loader
      // {
      //   test: /\.(ttf|eot|svg|woff(2)?)(\?.*)?$/,
      //   loader: 'file-loader?name=../iconui/lib/fonts/[hash].[ext]'
      // }
    ]
  },
  resolve:{
    extensions:['', '.js', '.json']
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
}
