const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].chunk.js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    new CopyPlugin({
      patterns: [{
          from: 'public/icons',
          to: 'icons'
        },
        {
          from: 'public/offline-images',
          to: 'offline-images'
        }
      ]
    })
  ]
});