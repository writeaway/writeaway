const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    react: ['./src/index.ts'],
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
      template: 'src/index.html',
      filename: 'index.html',
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
