const
  fs = require('fs'),
  { lstatSync, readdirSync, } = require('fs');
path = require('path'),
  config = require('./config'),
  duboConfig = require('../dubo.config'),
  loaders = require('./loaders'),
  plugins = require('./plugins'),
  optimization = require('./optimization'),
  webpack = require('webpack'),
  autoprefixer = require("autoprefixer"),
  { resolve, } = require('./utils');


const isDirectory = source => lstatSync(source).isDirectory();
// 获取 src 下的所有目录
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory).map(file => file.slice(file.lastIndexOf('/') + 1));
// 将 src 下的目录拼接成 alias
const makeAliasOfSrc = getDirectories(resolve('src')).map(key => { return { [key]: resolve(`src/${key}`), }; }).reduce((acc, cur) => acc = { ...acc, ...cur, });

module.exports = {
  mode: config.isProd ? 'production' : 'development',
  entry: {
    app: ['babel-polyfill', resolve('src/index.tsx')],
  },
  output: {
    path: resolve(`dist/${config.mode}/`),
    publicPath: config.mode !== 'prod' ? '/' : config.staticUrl,
    filename: config.isProd ? 'assets/js/build.[chunkhash:5].js' : 'build.js',
    chunkFilename: config.isProd ? 'assets/js/[name].[chunkhash:5].js' : '[name].js',
  },
  module: {
    rules: loaders,
  },
  plugins: plugins.concat(new webpack.LoaderOptionsPlugin({
  })),
  optimization,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    modules: [resolve('src'), resolve('node_modules')],
    alias: {
      ...makeAliasOfSrc,
      '@ibot': 'node_modules',
    },
  },
  stats: {
    children: false,
  },
  devtool: config.isProd ? false : 'source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    // port: 80,
    https: config.openssl ? {
      key: duboConfig.https.key,
      cert: duboConfig.https.cert,
      ca: duboConfig.https.ca,
    } : false,
    // overlay: true,
    contentBase: resolve('.'),
    // open: true,
    hot: true,
    proxy: {
      '/api/moon': {
        // target: 'http://api.cangshu360.com',
        // target: 'https://api.trading8a.com',
        target: "https://api.sugargirls.live",
        pathRewrite: { '^/api/moon': '', },
        secure: false,
        changeOrigin: true,
      },
    },
  },
};
