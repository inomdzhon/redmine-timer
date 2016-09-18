'use strict';

/**
 * @global gulp
 * @global config
 */

gulp.task('manifest', function() {
  return gulp.src(config.src.manifest.path).
    pipe( gulp.dest(config.public.path) );
});
