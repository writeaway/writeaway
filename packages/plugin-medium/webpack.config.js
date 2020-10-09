const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    'plugin-medium': ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    // libraryExport: 'default',
    library: {
      amd: '@writeaway/medium',
      commonjs: '@writeaway/medium',
      root: 'WriteAwayPluginMedium',
    },
  },

  externals: [
    '@writeaway/core',
    'autobind-decorator',
    'classnames',
    'medium-editor',
    'react',
    'react-dom',
  ],

  resolve: {
    ...baseConfig.resolve,
    modules: ['node_modules', 'src'],
  },
};

module.exports = config;
