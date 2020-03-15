const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: path.resolve('client', 'js', 'index.js'),
  },
  resolve: {
    alias: {
      '@': path.resolve('client', 'js'),
      'config': path.resolve('config'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve('static', 'js'),
    library: 'boilerplate',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
              ["@babel/plugin-proposal-decorators", { "legacy": true }]
            ],
          }
        }
      }, {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({ overrideBrowserslist: 'last 10 versions' })
                ]
              }
            },
            'sass-loader'
          ]
        })
      }, {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      }, {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: !isProduction,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    // minimizer: [new UglifyJsPlugin({ test: /\.js(\?.*)?$/i, })],
  },
  plugins: [
    new ExtractTextPlugin('../css/[name].css'),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new CompressionPlugin({
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip'
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
        S3_BUCKET_NAME: JSON.stringify(process.env.S3_BUCKET_NAME),
        PORT: process.env.PORT || 5555,
        STATIC: JSON.stringify(process.env.STATIC || 'https://static.boilerplace.hu/'),
        VERSION: JSON.stringify(process.env.VERSION),
        NOT_FOUND_PATH: JSON.stringify(require('./config').noSchoolPath),
      },
    }),
  ],
  externals: [
    {
      'isomorphic-fetch': {
        root: 'isomorphic-fetch',
        commonjs2: 'isomorphic-fetch',
        commonjs: 'isomorphic-fetch',
        amd: 'isomorphic-fetch'
      }
    },
    'react-helmet',
  ],
  devtool: !isProduction && 'source-map',
};
