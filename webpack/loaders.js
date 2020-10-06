const path = require('path');
const { readdirSync } = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const makeIncludeFunction = (namespace) => {
  const allPackages = readdirSync(path.join(__dirname, '..', '/packages'));
  return (p) => {
    const include = p.indexOf('@writeaway') >= 0
            || !!allPackages.find((pack) => p.indexOf(`packages${path.sep}${pack}`) >= 0);
    return include;
  };
};

function makeUrlLoader(pattern) {
  return {
    test: pattern,
    use: [
      'url',
    ],
    exclude: /node_modules/,
  };
}

exports.jsmap = {
  test: /\.jsx?$/,
  use: [
    'source-map-loader',
  ],
  include: makeIncludeFunction('js-map'),
  enforce: 'pre',
};

exports.css = {
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader?-url&sourceMap',
  ],
};

exports.less = {
  test: /\.less$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'less-loader',
    },
  ],
};



exports.asIs = {
  loader: 'do-nothing-loader',
  include: makeIncludeFunction('do-nothing'),
};

exports.ts = {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    transpileOnly: false,
  },
};

exports.svg = makeUrlLoader(/\.svg$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
