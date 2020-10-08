const baseConfig = require('../../webpack/config');

const config = {
    ...baseConfig,

    entry: {
        'bundle': ['./src/index.ts'],
    },

    output: {
        ...baseConfig.output,
        libraryExport: 'default',
        library: {
            amd: '@writeaway/bundle',
            commonjs: '@writeaway/bundle',
            root: 'WriteAwayBundle',
        },
    },

    resolve: {
        ...baseConfig.resolve,
        modules: ['node_modules', 'src'],
    }
};

module.exports = config;
