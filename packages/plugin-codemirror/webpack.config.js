const baseConfig = require('../../webpack/config');

const config = {
    ...baseConfig,

    entry: {
        'plugin-medium': ['./src/index.ts'],
    },

    output: {
        ...baseConfig.output,
        libraryExport: 'default',
        library: {
            amd: '@writeaway/codemirror',
            commonjs: '@writeaway/codemirror',
            root: 'WriteAwayPluginCodemirror',
        },
    },

    resolve: {
        ...baseConfig.resolve,
        modules: ['node_modules', 'src'],
    }
};

module.exports = config;
