'use strict';
var path = require('path');

module.exports = {
    entry: {
        bundleRedaxtor : path.join(__dirname, 'index')
    },
    output: {
        filename: 'RedaxtorBundle.js',
        library: 'RedaxtorBundle',
        libraryTarget: 'umd'
    },
    plugins: [

    ],
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [//https://github.com/babel/babel-loader/issues/166#issuecomment-160866946
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-react')
                    ],
                    plugins: [
                        'babel-plugin-transform-object-rest-spread'
                    ]
                    // presets: ['es2015', 'react']
                }
            },
            {
                test: /\.less$/,
                loader: "style!css?-url!less"
            },
            {
                test: /\.css/,
                loader: "style!css?-url"
            }
        ]
    },
    devtool: "eval"
};