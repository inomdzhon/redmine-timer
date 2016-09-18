'use strict';

/**
 * @global gulp
 * @global config
 */

gulp.task('images', ['clean:images'], function() {
  return gulp.src(config.src.images.all).
    pipe( gulp.dest(config.public.images.path) );
});
