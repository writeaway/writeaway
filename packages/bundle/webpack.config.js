const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    writeaway: ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    libraryExport: 'default',
    library: {
      amd: '@writeaway/bundle',
      commonjs: '@writeaway/bundle',
      root: 'writeaway',
    },
  },

  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      template: 'examples/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: 'examples/charlesmudy.html',
      filename: 'charlesmudy.html',
    }),
    new CopyPlugin({
      patterns: [
        // { from: 'examples', to: '' },
        { from: '../core/docs', to: 'docs' },
        { from: './src/api/images', to: 'images' },
      ],
    }),
  ],

  resolve: {
    ...baseConfig.resolve,
    modules: ['node_modules', 'src'],
    alias: {
      'medium-editor$': 'medium-editor/dist/js/medium-editor',
    },
  },
};

module.exports = config;
