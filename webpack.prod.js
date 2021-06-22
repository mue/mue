const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ZipFilePlugin = require('zip-file-webpack-plugin');

module.exports = (env) => {
  const type = env.type || 'web';

  return merge(common, {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[chunkhash].chunk.js',
      clean: true
    },
    cache: {
      type: 'filesystem'
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
          },
          {
            from: `manifest/${type}.json`,
            to: 'manifest.json'
          }
        ]
      }),
      new ZipFilePlugin({
        path: '../dist/',
        filename: `${type}.zip`
      })
    ]
  });
}