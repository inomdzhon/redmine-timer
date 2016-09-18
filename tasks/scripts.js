'use strict';

/**
 * @global gulp
 *
 * webpack node.js api documentaion:
 * https://github.com/webpack/docs/wiki/node.js-api
 */

const webpack  = require('webpack');
const gutil    = require('gulp-util');
const notifier = require('node-notifier');

let webpackConfig = require('../webpack.config.js');
let statsLog      = {
  colors: true,
  reasons: true
};

gulp.task('scripts', (done) => {
  // run webpack
  webpack(webpackConfig, onComplete);

  function onComplete(error, stats) {
    if (error) { // fatal error
      onError(error);
    } else if ( stats.hasErrors() ) { // soft error
      onError( stats.toString(statsLog) );
    } else {
      onSuccess( stats.toString(statsLog) );
    }
  }

  function onError(error) {
    let formatedError = new gutil.PluginError('webpack', error);

    notifier.notify({
      title: `Error: ${formatedError.plugin}`,
      message: formatedError.message
    });

    done(formatedError);
  }

  function onSuccess(detailInfo) {
    gutil.log('[webpack]', detailInfo);
    done();
  }
});

