'use strict';
var path = require('path');

module.exports = {
    entry: {
        bundleRedaxtor : path.join(__dirname, 'index')
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    plugins: [

    ],
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                loader: 'babel-loader',
                query: {
                    presets: [//https://github.com/babel/babel-loader/issues/166#issuecomment-160866946
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ]
                    // presets: ['es2015', 'stage-1', 'react']
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