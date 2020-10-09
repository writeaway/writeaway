const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    core: ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    // libraryExport: 'default',
    library: {
      amd: '@writeaway/core',
      commonjs: '@writeaway/core',
      root: 'WriteAway',
    },
  },

  externals: [
    'autobind-decorator',
    'classnames',
    'react',
    'react-dom',
    'react-redux',
    'react-redux-toastr',
    'redux',
    'redux-devtools-extension',
    'redux-thunk',
  ],

  resolve: {
    ...baseConfig.resolve,
    modules: ['node_modules', 'src'],
  },
};

module.exports = config;
