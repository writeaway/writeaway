'use strict';
var path = require('path');
var autoprefixer = require('autoprefixer');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var env = process.env.NODE_ENV;
var webpack = require(path.resolve(node_modules_dir, 'webpack'));

var config = {
    entry: {
        bundleRedaxtor: path.join(__dirname, 'index')
    },
    output: {
        filename: 'Redaxtor.js',
        library: 'Redaxtor',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ],
    module: {
        loaders: [
            {
                test: /\.(js)$/, exclude: /(node_modules)/,
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
                test: /\.less$/, exclude: /(node_modules)/,
                loader: "style!css?sourceMap!postcss!less?sourceMap"
            },
            {
                test: /\.css$/, exclude: /(node_modules|medium)/,
                loader: "style!css?sourceMap!postcss"
            },
            {
                test: /\.(woff)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, exclude: /(node_modules)/,
                loaders: ["url-loader?limit=10000"]
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, "node_modules")
    },
    resolveLoader: {root: path.join(__dirname, "node_modules")},
    devtool: "eval",
    postcss: [autoprefixer({browsers: ['last 2 versions']})]
};

if (env === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    )
}

module.exports = config;