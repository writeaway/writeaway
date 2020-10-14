const path = require('path');

const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'source-map',

  entry: {},

  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx',
      '.json',
      '.web.js',
      '.less',
      '.css',
    ],
  },

  plugins,

  module: {
    rules: [
      loaders.jsmap,
      // loaders.asIs,
      // loaders.js,
      loaders.ts,
      loaders.css,
      loaders.less,
    ],
  },

  devServer: {
    historyApiFallback: { index: '/' },
  },
};
