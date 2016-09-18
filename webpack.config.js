'use strict';

/**
 * webpack documentation: https://webpack.github.io/docs
 */

const webpack  = require('webpack');
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';
const paths    = {
  src    : __dirname + '/src/scripts',
  public : __dirname + '/public/assets/js',
};

module.exports = {

  context: paths.src,

  entry: {
    background: './background',
    content: './content',
    popup: './popup',
    options: './options'
  },

  output: {
    path: paths.public,
    filename: '[name].js',
    library: 'app',
    pathinfo: true
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  plugins: []
};

if (NODE_ENV == 'development') {
  module.exports.devtool = 'cheap-module-source-map';
}

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ // minifying scripts
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: false
      }
    })
  );
}
