'use strict';
var path = require('path');

module.exports = {
    entry: {
        app : path.join(__dirname, 'index')
    },
    output: {
        // path: path.join(__dirname),
        filename: '[name].js'
    },
    plugins: [

    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-1', 'react']
                }
            },
            { test: /\.json/, loader: "json" },
            {
                test: /\.less$/,
                loader: "style!css?-url!less"//don't use loaders for urls
            }
        ]
    },
    node: {
        fs: "empty",
        child_process: 'empty'
    },
    resolve: {
        extensions: ['','.js', '.jsx']
    },
    // devtool: "eval-source-map"
    devtool: "eval-cheap-source-map"
};