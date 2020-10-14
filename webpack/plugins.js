// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const basePlugins = [
  new webpack.DefinePlugin({
    'process.env.VERSION': JSON.stringify(require('../package.json').version),
    'process.env.BUILD_TIME': JSON.stringify((new Date()).toString()),
    __DEV__: process.env.NODE_ENV !== 'production',
    __TEST__: JSON.stringify(process.env.TEST || false),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new webpack.LoaderOptionsPlugin({
    debug: true,
  }),
  // eslint-disable-next-line no-useless-escape
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /en/),
];// .concat(sourceMap);

const cssExtractorOptions = {
  filename: 'css/[name].css',
  sourceMapFilename: 'css/[name].map',
};

const devPlugins = [
  new MiniCssExtractPlugin(cssExtractorOptions),
];

const prodPlugins = [
  new MiniCssExtractPlugin(cssExtractorOptions),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    generateStatsFile: true,
    reportFilename: 'bundle_report.html',
    statsFilename: 'bundle_stats.json',
    openAnalyzer: false,
  }),
];

module.exports = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);
