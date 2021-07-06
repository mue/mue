const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode: 'development',
  performance: {
    hints: false
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: ''
          },
        },
        'css-loader',
        'sass-loader'
      ],
    },
    {
      test: /\.(woff|woff2|svg)$/,
      type: 'asset/resource'
    },
    {
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader']
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].chunk.js',
    clean: true
  },
  devServer: {
    static: path.resolve(__dirname, './build'),
    open: true,
    port: 3000
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
          from: 'public/welcome-images',
          to: 'welcome-images'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].[chunkhash].chunk.css'
    }),
  ]
};
