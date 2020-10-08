const baseConfig = require('../../webpack/config');

const config = {
    ...baseConfig,

    entry: {
        'plugin-seo': ['./src/index.ts'],
    },

    output: {
        ...baseConfig.output,
        libraryExport: 'default',
        library: {
            amd: '@writeaway/seo',
            commonjs: '@writeaway/seo',
            root: 'WriteAwayPluginSeo',
        },
    },

    resolve: {
        ...baseConfig.resolve,
        modules: ['node_modules', 'src'],
    }
};

module.exports = config;
