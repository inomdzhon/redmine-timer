'use strict';

/**
 * @global gulp
 * @global config
 */

const rimraf = require('rimraf');

gulp.task('clean', (cb) => {
  return rimraf(config.public.path, cb);
});

gulp.task('clean:images', (cb) => {
  return rimraf(config.public.images.path, cb);
});
