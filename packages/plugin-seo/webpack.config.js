const baseConfig = require('../../webpack/config');

const config = {
  ...baseConfig,

  entry: {
    'plugin-seo': ['./src/index.ts'],
  },

  output: {
    ...baseConfig.output,
    // libraryExport: 'default',
    library: {
      amd: '@writeaway/seo',
      commonjs: '@writeaway/seo',
      root: 'WriteAwayPluginSeo',
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
