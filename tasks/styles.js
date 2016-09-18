'use strict';

/**
 * @global gulp
 * @global config
 */

const stylus       = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const cssBase64    = require('gulp-css-base64');
const util         = require('gulp-util');
const notifier     = require('node-notifier');

// extend config
config.params.stylus.use = [ autoprefixer('last 2 versions') ];

gulp.task('styles', (done) => {
  gulp.src(config.src.styles.main).
    pipe( stylus(config.params.stylus).on('error', onError) ).
    pipe( cssBase64(config.params.cssBase64) ).
    pipe( gulp.dest(config.public.styles.path) ).
    on('end', onSuccess)

  function onError(error) {
    notifier.notify({
      title: `Error: ${error.plugin}`,
      message: error.message
    });

    done(error);
  }

  function onSuccess() {
    done();
  }
});
