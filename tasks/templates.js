'use strict';

/**
 * @global gulp
 * @global config
 */

const twig     = require('gulp-twig');
const util     = require('gulp-util');
const notifier = require('node-notifier');

gulp.task('templates', (done) => {
  gulp.src(config.src.templates.main).
    pipe( twig().on('error', onError) ).
    pipe( gulp.dest(config.public.path) ).
    on('end', onSuccess);

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
