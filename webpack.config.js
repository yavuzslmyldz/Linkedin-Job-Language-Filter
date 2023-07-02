const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: "./src/content_script.ts",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'content_script.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {from: "public", to: "."}
      ],
    }),
    new CleanWebpackPlugin(),
  ]
};
