const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    'writeaway-spiral': ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    library: {
      amd: '@writeaway/spiral',
      commonjs: '@writeaway/spiral',
      root: 'WriteAwayBridge',
    },
  },

  resolve: {
    ...baseConfig.resolve,
    modules: ['node_modules', 'src'],
    alias: {
      'medium-editor$': 'medium-editor/dist/js/medium-editor',
    },
  },
};

module.exports = config;
