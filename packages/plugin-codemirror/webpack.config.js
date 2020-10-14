const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    'plugin-codemirror': ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    // libraryExport: 'default',
    library: {
      amd: '@writeaway/codemirror',
      commonjs: '@writeaway/codemirror',
      root: 'WriteAwayPluginCodemirror',
    },
  },

  externals: [
    '@writeaway/core',
    'autobind-decorator',
    'classnames',
    'prismjs',
    'react-simple-code-editor',
    'js-beautify',
    'medium-editor',
    'react',
    'react-dom',
    'react-modal',
  ],

  resolve: {
    ...baseConfig.resolve,
    modules: ['node_modules', 'src'],
  },
};

module.exports = config;
