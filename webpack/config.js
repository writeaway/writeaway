const path = require('path');

const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',

  entry: {},

  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  resolve: {
    extensions: [
      '.js',
      '.ts',
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
    ],
  },

  devServer: {
    historyApiFallback: { index: '/' },
  },
};
